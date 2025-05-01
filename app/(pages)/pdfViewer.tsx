import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator, Pressable, Alert, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Text, Button } from 'react-native-paper';
import PdfHandler, { PDFInfo } from '../../utils/pdfCache';
import * as Linking from 'expo-linking';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';

export default function PdfViewer() {
    const { uri, title } = useLocalSearchParams();
    const [pdfInfo, setPdfInfo] = useState<PDFInfo>({ localUri: '' });
    const [error, setError] = useState<string | null>(null);
    const [useWebView, setUseWebView] = useState(false);
    const [webViewKey, setWebViewKey] = useState(0);

    const loadPdf = async () => {
        try {
            console.log('Loading PDF:', uri);
            const result = await PdfHandler.getPdfUri(uri as string);
            console.log('PDF load result:', result);
            
            setPdfInfo(result);
            if (result.error) {
                setError(result.error);
                Alert.alert('Hata', 'PDF yüklenirken bir hata oluştu.');
            }
        } catch (err) {
            console.error('Error loading PDF:', err);
            setError('PDF yüklenirken bir hata oluştu');
            Alert.alert('Hata', 'PDF yüklenirken beklenmeyen bir hata oluştu.');
        }
    };

    useEffect(() => {
        loadPdf();
    }, [uri]);

    const openInExternalViewer = async () => {
        try {
            if (pdfInfo.localUri) {
                if (Platform.OS === 'ios') {
                    const contentUri = await FileSystem.getContentUriAsync(pdfInfo.localUri);
                    console.log('Opening in external viewer (iOS):', contentUri);
                    await Linking.openURL(contentUri);
                } else {
                    const contentUri = `file://${pdfInfo.localUri}`;
                    console.log('Opening in external viewer (Android):', contentUri);
                    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                        data: contentUri,
                        flags: 1,
                        type: 'application/pdf'
                    });
                }
            } else {
                throw new Error('PDF dosyası bulunamadı');
            }
        } catch (err) {
            console.error('Error opening external viewer:', err);
            setError('PDF harici görüntüleyicide açılamadı');
            Alert.alert(
                'Hata',
                'PDF harici görüntüleyicide açılamadı. Lütfen cihazınızda bir PDF görüntüleyici olduğundan emin olun.'
            );
            // If external viewer fails, try WebView as fallback
            setUseWebView(true);
        }
    };

    const retryLoading = () => {
        setError(null);
        setPdfInfo({ localUri: '' });
        setWebViewKey(prev => prev + 1);
        setUseWebView(false);
        loadPdf();
    };

    const handleLoadError = (syntheticEvent: any) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error:', nativeEvent);
        setError('PDF görüntülenirken bir hata oluştu');
        // If WebView fails, suggest external viewer
        Alert.alert(
            'Uyarı',
            'PDF görüntüleyicide açılamadı. Harici görüntüleyicide açmak ister misiniz?',
            [
                {
                    text: 'Evet',
                    onPress: openInExternalViewer
                },
                {
                    text: 'İptal',
                    style: 'cancel'
                }
            ]
        );
    };

    const handleLoadProgress = ({ nativeEvent }: any) => {
        // Handle progress if needed
    };

    return (
        <View style={styles.container}>
            <Stack.Screen 
                options={{
                    title: title as string,
                    headerStyle: {
                        backgroundColor: '#282b30',
                    },
                    headerTintColor: '#fff',
                }}
            />
            {pdfInfo.localUri ? (
                <View style={styles.contentContainer}>
                    <View style={styles.viewerOptions}>
                        <Button 
                            mode="contained" 
                            onPress={openInExternalViewer}
                            style={styles.viewerButton}
                        >
                            Harici Görüntüleyicide Aç
                        </Button>
                        <Button 
                            mode="outlined" 
                            onPress={() => setUseWebView(true)}
                            style={[styles.viewerButton, styles.secondaryButton]}
                        >
                            Uygulama İçinde Aç
                        </Button>
                        <Button 
                            mode="outlined" 
                            onPress={() => router.back()}
                            style={[styles.viewerButton, styles.returnButton]}
                        >
                            Geri Dön
                        </Button>
                    </View>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Button 
                        mode="contained" 
                        onPress={retryLoading}
                        style={[styles.button, { marginTop: 20 }]}
                    >
                        Tekrar Dene
                    </Button>
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    <WebView
                        key={webViewKey}
                        style={styles.webview}
                        source={{
                            uri: `file://${pdfInfo.localUri}`,
                            headers: {
                                'Content-Type': 'application/pdf',
                                'Cache-Control': 'no-cache'
                            }
                        }}
                        originWhitelist={['*']}
                        startInLoadingState={true}
                        onLoadProgress={handleLoadProgress}
                        onError={handleLoadError}
                        cacheEnabled={true}
                        cacheMode="LOAD_CACHE_ELSE_NETWORK"
                        domStorageEnabled={true}
                        javaScriptEnabled={true}
                        androidLayerType="hardware"
                        renderLoading={() => (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#7289da" />
                                <Text style={styles.loadingText}>
                                    Yükleniyor...
                                </Text>
                            </View>
                        )}
                    />
                    <View style={styles.fallbackContainer}>
                        <Button 
                            mode="contained" 
                            onPress={openInExternalViewer}
                            style={styles.fallbackButton}
                        >
                            Harici Görüntüleyicide Aç
                        </Button>
                        <Button 
                            mode="outlined" 
                            onPress={() => router.back()}
                            style={[styles.fallbackButton, styles.returnButton, { marginTop: 8 }]}
                        >
                            Geri Dön
                        </Button>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#282b30',
    },
    contentContainer: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#FFFFFF',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#ff4444',
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#7289da',
    },
    viewerOptions: {
        padding: 190,
        gap: 20,
        alignItems: 'center',
    },
    viewerButton: {
        backgroundColor: '#7289da',
        minWidth: 200,
    },
    secondaryButton: {
        borderColor: '#7289da',
    },
    returnButton: {
        borderColor: '#ff4444',
        marginTop: 20,
    },
    fallbackContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'rgba(40, 43, 48, 0.9)',
        alignItems: 'center',
    },
    fallbackButton: {
        backgroundColor: '#7289da',
        minWidth: 200,
    },
}); 