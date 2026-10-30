import { Button } from '../components/ui/Button'

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80vh] flex-col items-start justify-center pt-32">
      <p className="eyebrow">404 · route not found</p>
      <h1 className="display mt-6 text-[clamp(2.4rem,6vw,5rem)]">
        This path isn’t <span className="serif-accent text-gradient">orchestrated</span> yet.
      </h1>
      <p className="mt-6 max-w-lg text-fg-soft">The page you were looking for doesn’t exist or has moved.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button to="/">Back to home</Button>
        <Button to="/contact" variant="secondary">Contact us</Button>
      </div>
    </section>
  )
}
