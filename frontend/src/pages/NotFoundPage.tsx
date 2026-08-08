import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="rounded-full bg-primary-muted p-4 text-primary">
        <Compass size={28} />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Page not found</h1>
        <p className="mt-1 text-sm text-text-secondary">The page you're looking for doesn't exist or was moved.</p>
      </div>
      <Link to="/" className="btn-primary">Back to home</Link>
    </div>
  );
}
