export default function handleError(err) {
  process.env.DEBUG && console.error(err);
  console.error(err.message);
  process.exit(1);
}
