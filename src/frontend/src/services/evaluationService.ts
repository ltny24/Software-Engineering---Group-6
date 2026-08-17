import api from './api';

export interface SurveyDto {
  surveyId: number;
  title: string;
  description: string;
  openDate: string;
  closeDate: string;
  status: 'Pending' | 'Completed' | 'Closed' | 'Draft';
  submittedAnswers?: string;
  submittedAt?: string;
}

export interface SurveyResponseRequest {
  responses: Record<string, any>;
  comments: string;
}

export const evaluationService = {
  getSurveys: async (): Promise<SurveyDto[]> => {
    return await api.get<SurveyDto[]>('/api/v1/evaluations');
  },

  getSurveyById: async (id: number): Promise<SurveyDto> => {
    return await api.get<SurveyDto>(`/api/v1/evaluations/${id}`);
  },

  submitSurvey: async (id: number, data: SurveyResponseRequest): Promise<SurveyDto> => {
    return await api.post<SurveyDto>(`/api/v1/evaluations/${id}`, data);
  },
};
