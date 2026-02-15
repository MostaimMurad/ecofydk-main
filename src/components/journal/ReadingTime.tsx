import { Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReadingTimeProps {
  content: string;
}

export const calculateReadingTime = (content: string): number => {
  // Strip HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, '');
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;
  const wordCount = plainText.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime);
};

const ReadingTime = ({ content }: ReadingTimeProps) => {
  const { t } = useLanguage();
  const minutes = calculateReadingTime(content);

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span>{minutes} {t('journal.readingTime')}</span>
    </div>
  );
};

export default ReadingTime;
