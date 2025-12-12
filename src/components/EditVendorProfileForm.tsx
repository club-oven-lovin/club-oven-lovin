'use client';

import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { updateVendorProfile } from '@/lib/dbActions';
import type { Vendor } from '@prisma/client';

const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const HOURS = [
    '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
];

interface Props {
    vendor: Vendor;
    onCancel: () => void;
    onSuccess: (updatedVendor: Vendor) => void;
}

export default function EditVendorProfileForm({ vendor, onCancel, onSuccess }: Props) {
    // Parse address
    // Expected format: "Street, City, State Zip"
    let initialStreet = '';
    let initialCity = '';
    let initialState = 'HI';
    let initialZip = '';

    if (vendor.address) {
        const parts = vendor.address.split(', ');
        if (parts.length >= 3) {
            initialStreet = parts[0];
            initialCity = parts[1];
            const stateZip = parts[2].split(' ');
            if (stateZip.length >= 2) {
                initialState = stateZip[0];
                initialZip = stateZip[1];
            }
        } else {
            // Fallback
            initialStreet = vendor.address;
        }
    }

    // Parse hours
    let initialStartHour = '7:00 AM';
    let initialEndHour = '7:00 PM';

    if (vendor.hours) {
        const parts = vendor.hours.split(' - ');
        if (parts.length === 2) {
            initialStartHour = parts[0];
            initialEndHour = parts[1];
        }
    }

    const [name, setName] = useState(vendor.name);
    const [street, setStreet] = useState(initialStreet);
    const [city, setCity] = useState(initialCity);
    const [state, setState] = useState(initialState);
    const [zip, setZip] = useState(initialZip);
    const [startHour, setStartHour] = useState(initialStartHour);
    const [endHour, setEndHour] = useState(initialEndHour);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);

        // Validation
        if (!name || !street || !city || !zip) {
            setError('Please fill in all required fields.');
            return;
        }

        if (!/^\d{5}$/.test(zip)) {
            setError('Zip code must be 5 digits.');
            return;
        }

        // Validate hours logic
        // Convert time string "H:00 AM" to minutes for comparison
        const parseTime = (t: string) => {
            const [time, period] = t.split(' ');
            let [h, m] = time.split(':').map(Number);
            if (period === 'PM' && h !== 12) h += 12;
            if (period === 'AM' && h === 12) h = 0;
            return h * 60 + m;
        };

        if (parseTime(startHour) >= parseTime(endHour)) {
            setError('End time must be later than start time.');
            return;
        }

        const fullAddress = `${street}, ${city}, ${state} ${zip}`;
        const fullHours = `${startHour} - ${endHour}`;

        try {
            const updated = await updateVendorProfile({
                id: vendor.id,
                name,
                address: fullAddress,
                hours: fullHours,
                owner: vendor.owner
            });
            onSuccess(updated);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile.');
        }
    };

    return (
        <div className="p-3 border rounded bg-light">
            <h5 className="mb-3">Edit Profile</h5>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Vendor Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Label>Location</Form.Label>
                <div className="ps-3 border-start mb-3">
                    <Form.Group className="mb-2">
                        <Form.Label className="text-muted small">Street Address</Form.Label>
                        <Form.Control
                            type="text"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                    </Form.Group>
                    <Row>
                        <Col md={5}>
                            <Form.Group className="mb-2">
                                <Form.Label className="text-muted small">City</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-2">
                                <Form.Label className="text-muted small">State</Form.Label>
                                <Form.Select
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                >
                                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-2">
                                <Form.Label className="text-muted small">Zip Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={zip}
                                    onChange={(e) => setZip(e.target.value)}
                                    maxLength={5}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </div>

                <Form.Label>Hours</Form.Label>
                <Row className="mb-4">
                    <Col>
                        <Form.Select value={startHour} onChange={(e) => setStartHour(e.target.value)}>
                            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                        </Form.Select>
                    </Col>
                    <Col xs="auto" className="d-flex align-items-center">to</Col>
                    <Col>
                        <Form.Select value={endHour} onChange={(e) => setEndHour(e.target.value)}>
                            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                        </Form.Select>
                    </Col>
                </Row>

                <div className="d-flex gap-2">
                    <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                </div>
            </Form>
        </div>
    );
}
