const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateCasualGamingContent() {
    console.log('🎮 Updating landing page with casual gaming tips messaging...\n')

    try {
        // Update hero title
        await prisma.landingContent.upsert({
            where: {
                section_key_language: {
                    section: 'hero',
                    key: 'title',
                    language: 'ms'
                }
            },
            update: {
                value: 'Masuk10'
            },
            create: {
                section: 'hero',
                key: 'title',
                value: 'Masuk10',
                language: 'ms'
            }
        })
        console.log('✅ Updated hero title')

        // Update hero subtitle - casual & engaging
        await prisma.landingContent.upsert({
            where: {
                section_key_language: {
                    section: 'hero',
                    key: 'subtitle',
                    language: 'ms'
                }
            },
            update: {
                value: 'Belajar Strategi Gaming Yang Terbukti Berkesan'
            },
            create: {
                section: 'hero',
                key: 'subtitle',
                value: 'Belajar Strategi Gaming Yang Terbukti Berkesan',
                language: 'ms'
            }
        })
        console.log('✅ Updated hero subtitle')

        // Update hero description - with gaming tips theme
        await prisma.landingContent.upsert({
            where: {
                section_key_language: {
                    section: 'hero',
                    key: 'description',
                    language: 'ms'
                }
            },
            update: {
                value: 'Tips lengkap cara tangkap ikan, buka kerang dekat seaworld, strategi beruang panjat pokok dapat madu & banyak lagi! Sertai 5,000+ members dalam komuniti eksklusif kami.'
            },
            create: {
                section: 'hero',
                key: 'description',
                value: 'Tips lengkap cara tangkap ikan, buka kerang dekat seaworld, strategi beruang panjat pokok dapat madu & banyak lagi! Sertai 5,000+ members dalam komuniti eksklusif kami.',
                language: 'ms'
            }
        })
        console.log('✅ Updated hero description')

        // Update CTA text
        await prisma.landingContent.upsert({
            where: {
                section_key_language: {
                    section: 'hero',
                    key: 'cta_text',
                    language: 'ms'
                }
            },
            update: {
                value: 'SERTAI KOMUNITI SEKARANG'
            },
            create: {
                section: 'hero',
                key: 'cta_text',
                value: 'SERTAI KOMUNITI SEKARANG',
                language: 'ms'
            }
        })
        console.log('✅ Updated CTA text')

        // Update footer tagline
        await prisma.landingContent.upsert({
            where: {
                section_key_language: {
                    section: 'footer',
                    key: 'tagline',
                    language: 'ms'
                }
            },
            update: {
                value: '© 2026 Masuk10. Komuniti Strategi Gaming Terbaik di Malaysia.'
            },
            create: {
                section: 'footer',
                key: 'tagline',
                value: '© 2026 Masuk10. Komuniti Strategi Gaming Terbaik di Malaysia.',
                language: 'ms'
            }
        })
        console.log('✅ Updated footer tagline')

        console.log('\n✅ All casual gaming content updated successfully!')
    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

updateCasualGamingContent()
