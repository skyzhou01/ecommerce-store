import { ButtonLink, Container, Eyebrow, Heading } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center">
      <Container width="prose" className="flex flex-col items-center gap-5 py-section text-center">
        <Eyebrow>Page not found</Eyebrow>
        <Heading as="h1" size="headline">
          This piece is no longer here
        </Heading>
        <p className="text-lead text-muted">
          The page you&rsquo;re looking for may have moved, or the collection is still
          being prepared.
        </p>
        <ButtonLink href="/" className="mt-3">
          Return home
        </ButtonLink>
      </Container>
    </main>
  );
}
