import { useEffect, useState, type FormEvent } from 'react';
import { getReviews, submitReview, type Review, type ReviewValidationReason } from '@/lib/api';
import { services } from '@/data/services';
import StarRating from '@/components/StarRating';

const ERROR_MESSAGES: Record<ReviewValidationReason, string> = {
  name_required: 'Please tell us your name.',
  comment_required: "Please add a few words about your visit — it can't be empty.",
  invalid_rating: 'Please pick a star rating between 1 and 5.',
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <div className="flex items-start justify-between mb-3 gap-3">
        <div>
          <p className="font-display text-lg text-espresso">{review.customer_name}</p>
          {review.service && <p className="text-xs text-rose-dark uppercase tracking-wide mt-0.5">{review.service}</p>}
        </div>
        <StarRating value={review.rating} size={15} />
      </div>
      <p className="text-sm text-espresso/70 leading-relaxed mb-3">{review.comment}</p>
      <p className="text-xs text-espresso/40">{timeAgo(review.created_at)}</p>
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [service, setService] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function loadReviews() {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await getReviews();
      setReviews(data.reviews);
      setAverageRating(data.average_rating);
      setTotalReviews(data.total_reviews);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReviews();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) return setFormError(ERROR_MESSAGES.name_required);
    if (rating < 1 || rating > 5) return setFormError(ERROR_MESSAGES.invalid_rating);
    if (!comment.trim()) return setFormError(ERROR_MESSAGES.comment_required);

    setSubmitting(true);
    try {
      const result = await submitReview({
        customer_name: name.trim(),
        rating,
        comment: comment.trim(),
        service: service || null,
      });

      if (!result.success) {
        setFormError(ERROR_MESSAGES[result.reason]);
        return;
      }

      setSubmitted(true);
      setName('');
      setRating(0);
      setComment('');
      setService('');
      await loadReviews();
    } catch {
      setFormError("Couldn't submit your review right now — please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-rose-dark mb-4">Client stories</p>
      <h1 className="font-display text-4xl sm:text-5xl text-espresso mb-6">What our clients say</h1>

      {!loading && !loadError && totalReviews > 0 && (
        <div className="flex items-center gap-3 mb-12">
          <StarRating value={averageRating} size={22} />
          <p className="text-espresso/70 text-sm">
            <span className="font-display text-xl text-espresso mr-1">{averageRating}</span>
            based on {totalReviews} review{totalReviews === 1 ? '' : 's'}
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_380px] gap-12">
        {/* Reviews list */}
        <div>
          {loading && <p className="text-sm text-espresso/50">Loading reviews…</p>}

          {!loading && loadError && (
            <p className="text-sm text-rose-dark">Couldn't load reviews right now — please refresh the page.</p>
          )}

          {!loading && !loadError && totalReviews === 0 && (
            <div className="rounded-2xl border border-dashed border-line p-10 text-center">
              <p className="font-display text-xl text-espresso mb-2">Be the first to leave a review</p>
              <p className="text-sm text-espresso/60">Tell other clients what your visit was like.</p>
            </div>
          )}

          {!loading && !loadError && totalReviews > 0 && (
            <div className="grid sm:grid-cols-2 gap-5">
              {reviews.map((r) => (
                <ReviewCard key={r.review_id} review={r} />
              ))}
            </div>
          )}
        </div>

        {/* Submission form */}
        <div className="rounded-2xl bg-espresso text-blush p-8 h-fit sticky top-24">
          <h2 className="font-display text-2xl mb-5">Leave a review</h2>

          {submitted ? (
            <div className="text-center py-8">
              <p className="font-display text-xl text-gold-light mb-2">Thank you!</p>
              <p className="text-sm text-blush/70 mb-5">Your review has been posted.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm underline decoration-gold underline-offset-4 hover:text-gold-light"
              >
                Leave another review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-blush/60 mb-1.5">Your name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-blush/10 border border-blush/20 px-3 py-2 text-sm placeholder:text-blush/40 focus:outline-none focus:border-rose"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-blush/60 mb-1.5">Rating</label>
                <StarRating value={rating} onChange={setRating} size={24} />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-blush/60 mb-1.5">Service (optional)</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-lg bg-blush/10 border border-blush/20 px-3 py-2 text-sm focus:outline-none focus:border-rose"
                >
                  <option value="" className="text-espresso">Not specific to a service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.name} className="text-espresso">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-blush/60 mb-1.5">Your review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg bg-blush/10 border border-blush/20 px-3 py-2 text-sm placeholder:text-blush/40 focus:outline-none focus:border-rose resize-none"
                  placeholder="Tell us about your visit…"
                />
              </div>

              {formError && <p className="text-xs text-rose-light">{formError}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-rose text-blush py-2.5 text-sm tracking-wide hover:bg-rose-dark transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting…' : 'Submit review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}