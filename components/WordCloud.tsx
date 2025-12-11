import React, { useMemo } from 'react';
import { KeywordData } from '../types';

interface WordCloudProps {
  keywords: KeywordData[];
}

const WordCloud: React.FC<WordCloudProps> = ({ keywords }) => {
  const maxCount = useMemo(() => Math.max(...keywords.map(k => k.count), 1), [keywords]);
  
  // Sort by count descending to put big words first (or mix them, but sorting helps layout)
  const sortedKeywords = useMemo(() => [...keywords].sort((a, b) => b.count - a.count), [keywords]);

  const getSize = (count: number) => {
    // Linear scale between 0.8rem and 2.5rem
    const minSize = 0.8;
    const maxSize = 2.5;
    const size = minSize + (count / maxCount) * (maxSize - minSize);
    return `${size.toFixed(2)}rem`;
  };

  const getColor = (category: 'praise' | 'complaint', count: number) => {
    const opacity = 0.6 + (count / maxCount) * 0.4;
    return category === 'praise' 
      ? `rgba(16, 185, 129, ${opacity})` // Emerald Green
      : `rgba(239, 68, 68, ${opacity})`; // Red
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 p-4 h-full overflow-y-auto content-center">
      {sortedKeywords.map((item, index) => (
        <span
          key={`${item.word}-${index}`}
          className="font-semibold transition-all duration-300 hover:scale-110 cursor-default select-none"
          style={{
            fontSize: getSize(item.count),
            color: getColor(item.category, item.count),
            textShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          title={`${item.count} occurrences`}
        >
          {item.word}
        </span>
      ))}
      {sortedKeywords.length === 0 && (
        <p className="text-gray-400 italic">No keywords extracted yet.</p>
      )}
    </div>
  );
};

export default WordCloud;