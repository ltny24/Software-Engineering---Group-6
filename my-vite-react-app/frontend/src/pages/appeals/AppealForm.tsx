import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { uploadFile, submitAppeal, fetchAppealConfig } from '../../services/api';
import { AppealFormData } from './types';

const AppealForm: React.FC = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<AppealFormData>();
    const [config, setConfig] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);
    const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const configData = await fetchAppealConfig();
                setConfig(configData);
            } catch (error) {
                console.error('Error fetching appeal config:', error);
            }
        };
        fetchConfig();
    }, []);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const onSubmit = async (data: AppealFormData) => {
        if (!file) {
            setSubmissionStatus('Please upload a file.');
            return;
        }

        const formData = new FormData();
        formData.append('course', data.course);
        formData.append('currentGrade', data.currentGrade);
        formData.append('reason', data.reason);
        formData.append('file', file);

        try {
            await submitAppeal(formData);
            setSubmissionStatus('Appeal submitted successfully!');
        } catch (error) {
            setSubmissionStatus('Error submitting appeal. Please try again.');
        }
    };

    return (
        <div className="appeal-form">
            <h2>Submit Grade Appeal</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Course:</label>
                    <input {...register('course', { required: true })} />
                    {errors.course && <span>This field is required</span>}
                </div>
                <div>
                    <label>Current Grade:</label>
                    <input type="number" {...register('currentGrade', { required: true })} />
                    {errors.currentGrade && <span>This field is required</span>}
                </div>
                <div>
                    <label>Reason:</label>
                    <textarea {...register('reason', { required: true })} />
                    {errors.reason && <span>This field is required</span>}
                </div>
                <div>
                    <label>Upload File:</label>
                    <input type="file" onChange={onFileChange} />
                </div>
                <button type="submit">Submit Appeal</button>
            </form>
            {submissionStatus && <p>{submissionStatus}</p>}
        </div>
    );
};

export default AppealForm;