import QRCode from 'qrcode'

/**
 * Generate QR code as data URL (base64 PNG)
 * @param text - Text to encode in QR code (usually a URL)
 * @param options - QR code generation options
 * @returns Promise resolving to base64 data URL
 */
export async function generateQRCode(
    text: string,
    options?: {
        width?: number
        margin?: number
        color?: {
            dark?: string
            light?: string
        }
    }
): Promise<string> {
    try {
        const dataUrl = await QRCode.toDataURL(text, {
            width: options?.width || 300,
            margin: options?.margin || 2,
            color: {
                dark: options?.color?.dark || '#000000',
                light: options?.color?.light || '#FFFFFF',
            },
            errorCorrectionLevel: 'M',
        })
        return dataUrl
    } catch (error) {
        console.error('QR Code generation error:', error)
        throw new Error('Failed to generate QR code')
    }
}

/**
 * Generate QR code as SVG string
 * @param text - Text to encode in QR code  
 * @param options - QR code generation options
 * @returns Promise resolving to SVG string
 */
export async function generateQRCodeSVG(
    text: string,
    options?: {
        width?: number
        margin?: number
        color?: {
            dark?: string
            light?: string
        }
    }
): Promise<string> {
    try {
        const svg = await QRCode.toString(text, {
            type: 'svg',
            width: options?.width || 300,
            margin: options?.margin || 2,
            color: {
                dark: options?.color?.dark || '#000000',
                light: options?.color?.light || '#FFFFFF',
            },
            errorCorrectionLevel: 'M',
        })
        return svg
    } catch (error) {
        console.error('QR Code SVG generation error:', error)
        throw new Error('Failed to generate QR code SVG')
    }
}

/**
 * Download QR code as PNG file
 * @param text - Text to encode in QR code
 * @param filename - Download filename (without extension)
 */
export async function downloadQRCode(text: string, filename: string = 'qrcode'): Promise<void> {
    try {
        const dataUrl = await generateQRCode(text, { width: 512 })

        // Create download link
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = `${filename}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        console.error('QR Code download error:', error)
        throw new Error('Failed to download QR code')
    }
}
