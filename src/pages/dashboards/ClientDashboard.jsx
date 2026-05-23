import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import axios from '../../lib/axios';

export default function ClientDashboard() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get('/bookings').then(res => setBookings(res.data)).catch(console.error);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Client Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map(b => (
                    <Card key={b.id}>
                        <CardHeader>
                            <CardTitle>Booking for {b.gig?.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Expert:</strong> {b.expert?.name}</p>
                            <p><strong>Status:</strong> <span className="uppercase text-sm font-bold text-primary">{b.status}</span></p>
                            <p><strong>Scheduled:</strong> {b.scheduled_at || 'TBD'}</p>
                            {b.verification_report_path && (
                                <a href={`http://localhost:8000/storage/${b.verification_report_path}`} target="_blank" rel="noreferrer" className="text-blue-500 underline mt-4 block">
                                    Download Final PDF Report
                                </a>
                            )}
                            <p className="mt-4 text-xs text-gray-500">Payment must be handed on-site directly to the expert.</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
