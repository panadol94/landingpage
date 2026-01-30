import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth-config"

// GET /api/analytics/stats - Get overall statistics
export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Parse date range from query parameters
        const { searchParams } = new URL(request.url)
        const startDateParam = searchParams.get('startDate')
        const endDateParam = searchParams.get('endDate')

        // Set date range - default to all time if not provided
        const startDate = startDateParam ? new Date(startDateParam) : new Date(0)
        const endDate = endDateParam ? new Date(endDateParam) : new Date()

        // Calculate fixed time periods for stats cards
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const [
            totalShortlinks,
            activeShortlinks,
            totalClicks,
            clicksToday,
            clicksThisWeek,
            clicksThisMonth,
            topLinks
        ] = await Promise.all([
            // Total shortlinks
            prisma.shortlink.count(),

            // Active shortlinks
            prisma.shortlink.count({
                where: { isActive: true }
            }),

            // Total clicks (filtered by date range)
            prisma.shortlinkClick.count({
                where: {
                    clickedAt: {
                        gte: startDate,
                        lte: endDate
                    }
                }
            }),

            // Clicks today (always show today's stats)
            prisma.shortlinkClick.count({
                where: {
                    clickedAt: { gte: today }
                }
            }),

            // Clicks this week (always show this week's stats)
            prisma.shortlinkClick.count({
                where: {
                    clickedAt: { gte: thisWeek }
                }
            }),

            // Clicks this month (always show this month's stats)
            prisma.shortlinkClick.count({
                where: {
                    clickedAt: { gte: thisMonth }
                }
            }),

            // Top 5 links (filtered by date range)
            prisma.shortlink.findMany({
                take: 5,
                where: {
                    clicks: {
                        some: {
                            clickedAt: {
                                gte: startDate,
                                lte: endDate
                            }
                        }
                    }
                },
                include: {
                    clicks: {
                        where: {
                            clickedAt: {
                                gte: startDate,
                                lte: endDate
                            }
                        }
                    },
                    _count: {
                        select: {
                            clicks: {
                                where: {
                                    clickedAt: {
                                        gte: startDate,
                                        lte: endDate
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    clicks: {
                        _count: 'desc'
                    }
                }
            })
        ])

        // Device breakdown (filtered by date range)
        const deviceStats = await prisma.shortlinkClick.groupBy({
            by: ['deviceType'],
            _count: true,
            where: {
                clickedAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })

        // Browser breakdown (filtered by date range)
        const browserStats = await prisma.shortlinkClick.groupBy({
            by: ['browser'],
            _count: true,
            where: {
                clickedAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                _count: {
                    browser: 'desc'
                }
            }
        })

        return NextResponse.json({
            success: true,
            data: {
                dateRange: {
                    start: startDate.toISOString(),
                    end: endDate.toISOString()
                },
                shortlinks: {
                    total: totalShortlinks,
                    active: activeShortlinks
                },
                clicks: {
                    total: totalClicks,
                    today: clicksToday,
                    thisWeek: clicksThisWeek,
                    thisMonth: clicksThisMonth
                },
                topLinks: topLinks.map((link: { code: string; destination: string; title: string | null; _count: { clicks: number } }) => ({
                    code: link.code,
                    destination: link.destination,
                    title: link.title,
                    clicks: link._count.clicks
                })),
                devices: deviceStats.map((d: { deviceType: string | null; _count: number }) => ({
                    type: d.deviceType || 'unknown',
                    count: d._count
                })),
                browsers: browserStats.map((b: { browser: string | null; _count: number }) => ({
                    name: b.browser || 'unknown',
                    count: b._count
                }))
            }
        })
    } catch (error) {
        console.error('Error fetching analytics:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch analytics' },
            { status: 500 }
        )
    }
}
