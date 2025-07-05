import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Changeling VR',
    short_name: 'ChangelingVR',
    description:
      'Changeling VR, a narrative mystery game by students in the school of interactive games and media.',
    lang: 'en-US',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#ffcc66',
    background_color: '#002033',
    categories: ['games', 'narrative', 'mystery'],
    icons: [
      {
        src: '/manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/media/press/PressKitScreenshot_01.jpg',
        sizes: '1920x1080',
        type: 'image/png',
        label: 'Changeling VR Screenshot 1',
      },
      {
        src: '/media/press/PressKitScreenshot_02.jpg',
        sizes: '1920x1080',
        type: 'image/png',
        label: 'Changeling VR Screenshot 2',
      },
      {
        src: '/media/press/PressKitScreenshot_03.jpg',
        sizes: '1920x1080',
        type: 'image/png',
        label: 'Changeling VR Screenshot 3',
      },
      {
        src: '/media/press/PressKitScreenshot_04.jpg',
        sizes: '1920x1080',
        type: 'image/png',
        label: 'Changeling VR Screenshot 4',
      },
      {
        src: '/media/press/PressKitScreenshot_05.jpg',
        sizes: '1920x1080',
        type: 'image/png',
        label: 'Changeling VR Screenshot 5',
      },
      {
        src: '/media/press/PressKitScreenshot_06.jpg',
        sizes: '1920x1080',
        type: 'image/png',
        label: 'Changeling VR Screenshot 6',
      },
    ],
    shortcuts: [
      {
        name: 'Play Now',
        description: 'Download the game',
        url: '/download',
      },
      {
        name: 'Characters',
        description: 'Meet the characters of Changeling VR',
        url: '/characters',
      },
      {
        name: 'Team',
        description: 'Meet the team behind Changeling VR',
        url: '/teams',
      },
    ],
  };
}
