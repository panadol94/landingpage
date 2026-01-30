import { format } from 'date-fns'

interface Stats {
    shortlinks: {
        total: number
        active: number
    }
    clicks: {
        total: number
        today: number
        thisWeek: number
        thisMonth: number
    }
    topLinks: Array<{
        code: string
        title?: string
        clicks: number
    }>
    devices: Array<{
        type: string
        count: number
    }>
    browsers: Array<{
        name: string
        count: number
    }>
}

interface DateRange {
    start: Date
    end: Date
}

/**
 * Generate CSV content from analytics stats
 * @param stats - Analytics statistics object
 * @param dateRange - Date range for the report
 * @returns CSV string
 */
export function generateAnalyticsCSV(stats: Stats, dateRange: DateRange): string {
    const lines: string[] = []

    // Header
    lines.push('Masuk10 Analytics Report')
    lines.push(`Generated,${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`)
    lines.push(`Date Range,${format(dateRange.start, 'yyyy-MM-dd')},${format(dateRange.end, 'yyyy-MM-dd')}`)
    lines.push('')

    // Summary Statistics
    lines.push('Summary Statistics')
    lines.push('Metric,Value')
    lines.push(`Total Shortlinks,${stats.shortlinks.total}`)
    lines.push(`Active Shortlinks,${stats.shortlinks.active}`)
    lines.push(`Total Clicks,${stats.clicks.total}`)
    lines.push(`Clicks Today,${stats.clicks.today}`)
    lines.push(`Clicks This Week,${stats.clicks.thisWeek}`)
    lines.push(`Clicks This Month,${stats.clicks.thisMonth}`)
    lines.push('')

    // Top Performing Links
    lines.push('Top Performing Links')
    lines.push('Code,Title,Destination,Clicks')
    stats.topLinks.forEach(link => {
        const title = escapeCSV(link.title || '')
        lines.push(`${link.code},${title},,${link.clicks}`)
    })
    lines.push('')

    // Device Breakdown
    lines.push('Device Distribution')
    lines.push('Device Type,Count,Percentage')
    const totalDeviceClicks = stats.devices.reduce((sum, d) => sum + d.count, 0)
    stats.devices.forEach(device => {
        const percentage = totalDeviceClicks > 0
            ? ((device.count / totalDeviceClicks) * 100).toFixed(1)
            : '0.0'
        lines.push(`${device.type},${device.count},${percentage}%`)
    })
    lines.push('')

    // Browser Statistics
    lines.push('Browser Statistics')
    lines.push('Browser,Count,Percentage')
    const totalBrowserClicks = stats.browsers.reduce((sum, b) => sum + b.count, 0)
    stats.browsers.forEach(browser => {
        const percentage = totalBrowserClicks > 0
            ? ((browser.count / totalBrowserClicks) * 100).toFixed(1)
            : '0.0'
        lines.push(`${browser.name},${browser.count},${percentage}%`)
    })

    return lines.join('\n')
}

/**
 * Escape CSV field value (handle commas, quotes, newlines)
 * @param value - Field value to escape
 * @returns Escaped CSV field
 */
function escapeCSV(value: string): string {
    if (!value) return ''

    // If contains comma, quote, or newline, wrap in quotes and escape quotes
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`
    }

    return value
}

/**
 * Download CSV file to user's computer
 * @param content - CSV content string
 * @param filename - Base filename (without extension)
 */
export function downloadCSV(content: string, filename: string = 'analytics'): void {
    // Create blob from CSV content
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })

    // Create download link
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    // Set download attributes
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'

    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up
    URL.revokeObjectURL(url)
}

/**
 * Export analytics data as CSV and trigger download
 * @param stats - Analytics statistics
 * @param dateRange - Date range for the report
 * @param filename - Optional custom filename
 */
export function exportAnalyticsCSV(
    stats: Stats,
    dateRange: DateRange,
    filename: string = 'masuk10-analytics'
): void {
    const csv = generateAnalyticsCSV(stats, dateRange)
    downloadCSV(csv, filename)
}
