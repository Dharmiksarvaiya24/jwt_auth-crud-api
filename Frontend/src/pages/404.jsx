import { BackgroundPaths } from '../components/ui/background-paths';
const DEFAULT_IMAGE_URL =
  'https://img.freepik.com/free-vector/crash-airplane-illustration_1284-27251.jpg?semt=ais_hybrid&w=740&q=80';

export function NotFound ({ imageUrl = DEFAULT_IMAGE_URL }) {
  return (
    <BackgroundPaths>
      <div className="flex min-h-screen items-center justify-center px-4 py-12 font-serif">
        <div className="w-full max-w-2xl rounded-[2rem] border border-black/10 bg-white/95 p-6 text-center shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-black/80 sm:p-8">
          <div className="mx-auto h-[180px] w-full max-w-md bg-contain bg-center bg-no-repeat sm:h-[220px] md:h-[260px]" style={{ backgroundImage: `url(${imageUrl})` }} aria-hidden="true" />
          <p className="mt-4 text-2xl font-bold text-black dark:text-white sm:text-3xl">
            404 - Page Not Found
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>
      </div>
    </BackgroundPaths>
  );
}

export default NotFound;