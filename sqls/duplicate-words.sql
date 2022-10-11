SELECT word, COUNT(*)
FROM word_entity
WHERE lang = 'pl'
GROUP BY word
HAVING COUNT(*) > 1