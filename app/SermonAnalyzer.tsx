'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Loader2, BookOpen, CheckCircle } from 'lucide-react';

const SermonAnalyzer = () => {
  const [sermonText, setSermonText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const analyzeSermon = async () => {
    if (!sermonText.trim()) {
      alert('Please paste your sermon text first.');
      return;
    }

    setIsLoading(true);
    setAnalysis('');

    try {
      const response = await fetch('/api/analyze-sermon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sermonText: sermonText
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      setHasAnalyzed(true);
    } catch (error) {
      console.error('Error analyzing sermon:', error);
      setAnalysis('Sorry, there was an error analyzing your sermon. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setSermonText('');
    setAnalysis('');
    setHasAnalyzed(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold">Sermon Analyzer</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get professional feedback on your sermon. Paste your sermon text below and receive detailed analysis 
          on biblical foundation, structure, clarity, and practical application.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center mb-3">
            <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Your Sermon Text</h2>
          </div>
          
          <textarea
            value={sermonText}
            onChange={(e) => setSermonText(e.target.value)}
            placeholder="Paste your complete sermon text here..."
            className="w-full h-96 p-4 border border-border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background"
            disabled={isLoading}
          />
          
          <div className="flex space-x-3">
            <button
              onClick={analyzeSermon}
              disabled={isLoading || !sermonText.trim()}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Analyzing...' : 'Analyze Sermon'}
            </button>
            
            {hasAnalyzed && (
              <button
                onClick={resetAnalysis}
                className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                New Analysis
              </button>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Word count: {sermonText.trim().split(/\s+/).filter(word => word.length > 0).length}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="flex items-center mb-3">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold">Analysis & Feedback</h2>
          </div>
          
          <div className="h-96 p-4 border border-border rounded-lg bg-muted/30 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
                  <p className="text-muted-foreground">Analyzing your sermon...</p>
                  <p className="text-sm text-muted-foreground">This may take a few moments</p>
                </div>
              </div>
            ) : analysis ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {analysis}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p>Your analysis will appear here</p>
                  <p className="text-sm">Paste your sermon text and click "Analyze Sermon" to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">What You'll Get:</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Biblical foundation assessment</li>
          <li>• Structure and clarity evaluation</li>
          <li>• Practical application feedback</li>
          <li>• Engagement and delivery insights</li>
          <li>• Specific suggestions for improvement</li>
        </ul>
      </div>
    </div>
  );
};

export default SermonAnalyzer;