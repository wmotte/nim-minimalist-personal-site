import SermonAnalyzer from '@/app/SermonAnalyzer';

export const metadata = {
  title: 'Sermon Analyzer',
  description: 'Get professional feedback on your sermon with AI-powered analysis',
};

export default function SermonAnalyzerPage() {
  return (
    <div className="min-h-screen py-8">
      <SermonAnalyzer />
    </div>
  );
}