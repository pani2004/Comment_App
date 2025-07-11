import { useState } from 'react';
import CommentForm from './CommentForm';
import axios from '../../api/Axios';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  content: string;
  user: { name?: string; email: string };
  replies?: Comment[];
  createdAt: string;
  deletedAt?: string | null;
}

interface Props {
  comment: Comment;
  onRefresh: () => void;
}

export default function CommentItem({ comment, onRefresh }: Props) {
  const [showReply, setShowReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const minutesSinceCreated = Math.floor(
    (Date.now() - new Date(comment.createdAt).getTime()) / 60000
  );

  const canModify = minutesSinceCreated <= 15 && !comment.deletedAt;

  const handleEdit = async () => {
    try {
      await axios.patch(`/comments/${comment.id}`, { content: editContent });
      toast.success('Comment updated');
      setIsEditing(false);
      onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/comments/${comment.id}`);
      toast.success('Comment deleted');
      onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  const handleRestore = async () => {
    try {
      await axios.post(`/comments/${comment.id}/restore`);
      toast.success('Comment restored');
      onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to restore');
    }
  };

  return (
    <div className="border-l-2 pl-4 my-3">
      <div className="mb-1 text-sm text-gray-700">
        <span className="font-semibold">
          {comment.user?.name || comment.user?.email || '[Unknown User]'}
        </span>
        <span className="ml-2 text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
      </div>

      {comment.deletedAt ? (
        <p className="italic text-gray-500">[Deleted comment]</p>
      ) : isEditing ? (
        <>
          <textarea
            className="w-full border rounded px-2 py-1"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="flex gap-2 mt-2 text-sm">
            <button
              onClick={handleEdit}
              className="text-green-600 hover:underline"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p className="mb-2">{comment.content}</p>
      )}

      <div className="flex gap-4 text-xs text-blue-500 mt-1">
        {!comment.deletedAt && (
          <button onClick={() => setShowReply(!showReply)}>
            {showReply ? 'Cancel' : 'Reply'}
          </button>
        )}
        {canModify && !isEditing && (
          <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete} className="text-red-500">Delete</button>
          </>
        )}
        {comment.deletedAt && canModify && (
          <button onClick={handleRestore} className="text-yellow-600">Undo Delete</button>
        )}
      </div>

      {showReply && (
        <div className="mt-2">
          <CommentForm
            parentId={comment.id}
            onSuccess={() => {
              setShowReply(false);
              onRefresh();
            }}
          />
        </div>
      )}

      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
