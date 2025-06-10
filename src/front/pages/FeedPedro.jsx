import { useState } from 'react'
import ReportForm from '../components/ReportForm'
import ReportCard from '../components/ReportCard'

export const Feed = () => {
    const [reports, setReports] = useState([])

    const addReport = (newReport) => {
        setReports((prev) => [newReport, ...prev])
    }

    return (
        <div className="bg-light min-vh-100">

            <main className="container pt-5 mt-4">
                <div className="row">
                    <div className="col-12">
                        <ReportForm onSubmit={addReport} />
                    </div>
                </div>

                {reports.length === 0 && (
                    <p className="text-center text-muted my-5">Aún no hay reportes publicados.</p>
                )}

                <div className="row gy-4">
                    {reports.map((report) => (
                        <div key={report.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
                            <ReportCard report={report} currentUserId={report.currentUserId} />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
