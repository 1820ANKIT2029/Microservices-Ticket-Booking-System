interface AboutEventProps {
  paragraphs: string[];
}

export function AboutEvent({ paragraphs }: AboutEventProps) {
  return (
    <section aria-labelledby="about-title">
      <h2 id="about-title" className="text-headline-md font-bold mb-4 border-l-4 border-primary pl-3">
        About The Event
      </h2>
      <div className="text-on-surface-variant text-body-md space-y-4 leading-relaxed text-left font-medium">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
