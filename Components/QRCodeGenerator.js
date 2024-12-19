import React, { useEffect, useState, useRef } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import QRCode from 'qrcode';

function QRCodeGenerator({ orderId, getRef }) {
    const [qrCodeData, setQrCodeData] = useState('');
    const qrCodeRef = useRef(null); // Use useRef for the QR code image reference

    useEffect(() => {
        QRCode.toDataURL(orderId)
            .then(url => setQrCodeData(url))
            .catch(err => console.error(err));
    }, [orderId]);

    // Pass the ref to the parent component via the getRef callback
    useEffect(() => {
        if (getRef) {
            getRef(qrCodeRef.current); // Passing the ref to the parent component
        }
    }, [qrCodeRef, getRef]);

    return (
        <View style={styles.container}>
            {qrCodeData ? <Image source={{ uri: qrCodeData }} style={styles.qrCode} ref={qrCodeRef} /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    qrCode: {
        width: 200,
        height: 200,
    },
});

export default QRCodeGenerator;
