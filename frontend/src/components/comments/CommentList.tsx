import { useEffect, useState } from 'react';
import axios from '../../api/Axios';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

interface Comment {
  id: string;
  content: string;
  user: { name?: string; email: string };
  replies?: Comment[];
  createdAt: string;
}

export default function CommentList() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/comments/nested');
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">
      <CommentForm onSuccess={fetchComments} />
      <hr className="my-4" />
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet. Be the first!</p>
      ) : (
        comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onRefresh={fetchComments} />
        ))
      )}
    </div>
  );
}
