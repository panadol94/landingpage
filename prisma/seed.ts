import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/password'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@masuk10.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!Masuk10'

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    })

    const hashedPassword = await hashPassword(adminPassword)

    let admin
    if (existingAdmin) {
        console.log('✓ Admin user exists - updating password...')
        admin = await prisma.user.update({
            where: { email: adminEmail },
            data: {
                passwordHash: hashedPassword
            }
        })
        console.log('✅ Admin password updated!')
    } else {
        admin = await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash: hashedPassword,
                name: 'Admin',
                role: 'ADMIN'
            }
        })
        console.log('✅ Admin user created')
    }

    console.log('✅ Admin user created:')
    console.log(`   Email: ${admin.email}`)
    console.log(`   Password: ${adminPassword}`)
    console.log('   ⚠️  Change password after first login!')

    // Seed default landing page content
    const defaultContent = [
        // Hero section
        { section: 'hero', key: 'title', value: 'Masuk10' },
        { section: 'hero', key: 'subtitle', value: 'Platform Gaming & Link Pendek Terbaik' },
        { section: 'hero', key: 'description', value: 'Dapatkan tips gaming terkini dan cipta shortlink dalam sekelip mata' },
        { section: 'hero', key: 'cta_text', value: 'Mulakan Sekarang' },
        { section: 'hero', key: 'cta_url', value: 'https://wa.me/60123456789' },

        // Features
        { section: 'features', key: 'title', value: 'Kenapa Pilih Masuk10?' },
        { section: 'features', key: 'feature1_title', value: '🎮 Tips Gaming Terkini' },
        { section: 'features', key: 'feature1_desc', value: 'Dapatkan strategi dan tips terbaik untuk game popular' },
        { section: 'features', key: 'feature2_title', value: '🔗 Shortlink Pantas' },
        { section: 'features', key: 'feature2_desc', value: 'Cipta link pendek dalam sekelip mata' },
        { section: 'features', key: 'feature3_title', value: '📊 Analytics Lengkap' },
        { section: 'features', key: 'feature3_desc', value: 'Track clicks dan performance shortlink anda' },

        // Footer
        { section: 'footer', key: 'tagline', value: '© 2026 Masuk10. Platform Gaming Terpercaya.' },
    ]

    for (const content of defaultContent) {
        await prisma.landingContent.create({
            data: {
                ...content,
                language: 'ms',
                updatedBy: admin.id
            }
        })
    }

    console.log('✅ Default content created')
    console.log('\n🎉 Seeding complete!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
