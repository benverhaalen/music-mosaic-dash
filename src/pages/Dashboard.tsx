
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import SongSearch from '@/components/SongSearch';
import SongRecommendations from '@/components/SongRecommendations';
import PlaylistSection from '@/components/PlaylistSection';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import { useSpotify } from '@/contexts/SpotifyContext';

const Dashboard = () => {
  const { isAuthenticated } = useSpotify();
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine which section to show based on the current route
  const currentPath = location.pathname;
  const isDiscoverPage = currentPath === '/discover' || currentPath === '/dashboard';
  const isPlaylistsPage = currentPath === '/playlists';
  const isStatsPage = currentPath === '/stats';
  
  // Redirect to the appropriate section if needed
  useEffect(() => {
    if (currentPath === '/dashboard') {
      navigate('/discover', { replace: true });
    }
  }, [currentPath, navigate]);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <AnimatedTransition type="fade" className="mb-10">
          {isDiscoverPage && (
            <section className="space-y-12">
              <div className="max-w-md mx-auto mb-12 text-center">
                <h2 className="text-center text-3xl md:text-4xl font-extrabold mb-8">
                  Find Your Next Favorite Song
                </h2>
                <SongSearch 
                  onSelectTrack={setSelectedTrack}
                  className="mx-auto"
                />
              </div>
              
              {selectedTrack && (
                <AnimatedTransition type="scale">
                  <SongRecommendations 
                    seedTrack={selectedTrack}
                    onAddToPlaylist={(track) => console.log('Add to playlist:', track)}
                  />
                </AnimatedTransition>
              )}
            </section>
          )}
          
          {isPlaylistsPage && (
            <section className="min-h-[80vh]">
              <PlaylistSection />
            </section>
          )}
          
          {isStatsPage && (
            <section className="min-h-[80vh]">
              <AnalyticsDashboard />
            </section>
          )}
        </AnimatedTransition>
      </div>
    </Layout>
  );
};

export default Dashboard;
