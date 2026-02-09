import React from 'react';
import { Button } from './Button';
import type { WidgetConfig } from '../types/widget.types';

type SuggestedQuestion = WidgetConfig['suggestedQuestions'][number];

interface SuggestedQuestionsManagerProps {
  questions: SuggestedQuestion[];
  maxQuestionLength: number;
  maxQueryLength: number;
  onUpdateQuestion: (index: number, field: 'text' | 'query', value: string) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (index: number) => void;
}

export const SuggestedQuestionsManager: React.FC<SuggestedQuestionsManagerProps> = ({
  questions,
  maxQuestionLength,
  maxQueryLength,
  onUpdateQuestion,
  onAddQuestion,
  onRemoveQuestion
}) => {
  const disableAdd = questions.length >= 5;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Suggested Questions</h3>
        <Button
          onClick={onAddQuestion}
          disabled={disableAdd}
          variant="ghost"
          size="sm"
        >
          + Add Question
        </Button>
      </div>
      
      <div className="space-y-3">
        {questions.map((question, index) => (
          <div key={question.id || index} className="p-3 border border-black rounded-lg relative">
            <Button
              onClick={() => onRemoveQuestion(index)}
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-red-600 hover:text-red-700"
            >
              Remove
            </Button>
            <div className="space-y-2 pr-20">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Display Text (max {maxQuestionLength} chars)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Enforce the max length during typing
                      if (value.length <= maxQuestionLength) {
                        onUpdateQuestion(index, 'text', value);
                      } else {
                        onUpdateQuestion(index, 'text', value.substring(0, maxQuestionLength));
                      }
                    }}
                    maxLength={maxQuestionLength}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Button text"
                  />
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {question.text.length}/{maxQuestionLength}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Query (max {maxQueryLength} chars)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={question.query}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Enforce the max length during typing
                      if (value.length <= maxQueryLength) {
                        onUpdateQuestion(index, 'query', value);
                      } else {
                        onUpdateQuestion(index, 'query', value.substring(0, maxQueryLength));
                      }
                    }}
                    maxLength={maxQueryLength}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Query sent to API"
                  />
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {question.query.length}/{maxQueryLength}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
