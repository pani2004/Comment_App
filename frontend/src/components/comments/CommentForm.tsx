import { useState } from 'react';
import axios from '../../api/Axios';
import toast from 'react-hot-toast';

interface CommentFormProps {
  parentId?: string;
  onSuccess?: () => void;
}

export default function CommentForm({ parentId, onSuccess }: CommentFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return toast.error('Comment cannot be empty');

    try {
      await axios.post('/comments', { content, parentId });
      toast.success('Comment posted');
      setContent('');
      onSuccess?.(); 
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        className="w-full border rounded px-3 py-2"
        placeholder="Write a comment..."
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="text-right">
        <button type="submit" className="px-4 py-1 bg-blue-600 text-white rounded">
          {parentId ? 'Reply' : 'Comment'}
        </button>
      </div>
    </form>
  );
}
