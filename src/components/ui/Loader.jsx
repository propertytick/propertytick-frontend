export default function Loader({ fullScreen = false }) {
  const content = (
    <div className="flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-700 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {content}
      </div>
    );
  }

  return <div className="py-12">{content}</div>;
}
