import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addStatsButtonFields() {
    console.log('Adding stats button fields...')

    const fields = [
        { section: 'hero', key: 'stats_button_text', value: 'See Live Stats' },
        { section: 'hero', key: 'stats_button_url', value: '#' },
        { section: 'hero', key: 'stats_button_enabled', value: 'true' }
    ]

    for (const field of fields) {
        // Check if exists first
        const existing = await prisma.landingContent.findUnique({
            where: {
                section_key_language: {
                    section: field.section,
                    key: field.key,
                    language: 'ms'
                }
            }
        })

        if (existing) {
            console.log(`✓ Field ${field.key} already exists`)
            continue
        }

        // Get admin user
        const admin = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        })

        if (!admin) {
            console.error('❌ No admin user found')
            return
        }

        // Create new field
        await prisma.landingContent.create({
            data: {
                ...field,
                language: 'ms',
                updatedBy: admin.id
            }
        })

        console.log(`✅ Added field: ${field.key}`)
    }

    console.log('🎉 Done!')
}

addStatsButtonFields()
    .catch(e => {
        console.error('❌ Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
