export const exportToCSV = (data, filename = 'export.csv') => {
    // Convert array of objects to CSV
    if (!data || data.length === 0) {
        alert('No data to export')
        return
    }

    // Get headers from first object
    const headers = Object.keys(data[0])

    // Create CSV content
    let csv = headers.join(',') + '\n'

    data.forEach((row) => {
        const values = headers.map((header) => {
            const value = row[header]
            // Handle values with commas or quotes
            if (value === null || value === undefined) return ''
            const stringValue = String(value)
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`
            }
            return stringValue
        })
        csv += values.join(',') + '\n'
    })

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export const exportToPDF = async (element, filename = 'export.pdf') => {
    // Using html2pdf library (needs to be installed)
    // npm install html2pdf.js
    try {
        const html2pdf = (await import('html2pdf.js')).default

        const options = {
            margin: 10,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        }

        html2pdf().set(options).from(element).save()
    } catch (error) {
        console.error('Failed to export PDF:', error)
        alert('PDF export is not available. Please install html2pdf.js')
    }
}

export const prepareTasksForExport = (tasks) => {
    return tasks.map((task) => ({
        Title: task.title,
        Description: task.description || '',
        Project: task.project?.name || '',
        Status: task.status,
        Priority: task.priority,
        'Assigned To': task.assigned_user?.name || 'Unassigned',
        'Created By': task.creator?.name || '',
        'Due Date': task.due_date ? new Date(task.due_date).toLocaleDateString() : '',
        'Estimated Hours': task.estimated_hours || '',
        'Created At': new Date(task.created_at).toLocaleDateString(),
    }))
}

export const prepareProjectsForExport = (projects) => {
    return projects.map((project) => ({
        Name: project.name,
        Description: project.description || '',
        Status: project.status,
        Progress: `${project.progress}%`,
        'Total Tasks': project.tasks_count || 0,
        'Start Date': project.start_date ? new Date(project.start_date).toLocaleDateString() : '',
        'End Date': project.end_date ? new Date(project.end_date).toLocaleDateString() : '',
        'Created By': project.creator?.name || '',
        'Created At': new Date(project.created_at).toLocaleDateString(),
    }))
}