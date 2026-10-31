import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageWrapper } from './components/Shared';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <section className="shell flex min-h-[70vh] flex-col justify-center gap-6 py-20">
        <p className="eyebrow text-glass">Error 404</p>
        <h1 className="display-xl max-w-[14ch]">This page isn't here.</h1>
        <p className="text-muted text-lg measure">The link may be old, or the page may have moved. Head back to the windows.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary w-fit">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to home
        </button>
      </section>
    </PageWrapper>
  );
}
