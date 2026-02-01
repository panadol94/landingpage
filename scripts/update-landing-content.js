const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateLandingContent() {
    console.log('🔄 Updating landing page content to remove shortlink mentions...\n')

    try {
        // Update hero subtitle - remove "Link Pendek"
        await prisma.landingContent.update({
            where: {
                section_key_language: {
                    section: 'hero',
                    key: 'subtitle',
                    language: 'ms'
                }
            },
            data: {
                value: 'Platform Analytics Gaming Profesional'
            }
        })
        console.log('✅ Updated hero subtitle')

        // Update hero description - remove shortlink mention
        await prisma.landingContent.update({
            where: {
                section_key_language: {
                    section: 'hero',
                    key: 'description',
                    language: 'ms'
                }
            },
            data: {
                value: 'Dapatkan tips gaming terkini, analisis data, dan strategi terbaik untuk meningkatkan pemahaman anda'
            }
        })
        console.log('✅ Updated hero description')

        // Delete shortlink feature entries
        await prisma.landingContent.deleteMany({
            where: {
                section: 'features',
                key: {
                    in: ['feature2_title', 'feature2_desc', 'feature3_desc']
                }
            }
        })
        console.log('✅ Removed shortlink feature entries')

        console.log('\n✅ All updates completed successfully!')
    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

updateLandingContent()
