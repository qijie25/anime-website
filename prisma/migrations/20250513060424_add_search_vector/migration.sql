-- 1. Add the search_vector column
ALTER TABLE "Anime" 
ADD COLUMN "search_vector" tsvector;

-- 2. Populate it initially with title + description
UPDATE "Anime"
SET search_vector = to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''));

-- 3. Create a GIN index for fast full-text search
CREATE INDEX "search_vector_idx" ON "Anime" USING GIN (search_vector);

-- 4. Add a trigger to auto-update the column on INSERT/UPDATE
CREATE FUNCTION update_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    to_tsvector('english', coalesce(NEW.title, '') || ' ' || coalesce(NEW.description, ''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_search_vector
BEFORE INSERT OR UPDATE ON "Anime"
FOR EACH ROW EXECUTE FUNCTION update_search_vector();