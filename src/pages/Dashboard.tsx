
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import SongSearch from '@/components/SongSearch';
import SongRecommendations from '@/components/SongRecommendations';
import PlaylistSection from '@/components/PlaylistSection';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSpotify } from '@/contexts/SpotifyContext';
import { Search, ListMusic, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated } = useSpotify();
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState('discover');
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <AnimatedTransition type="fade" className="mb-10">
          <Tabs
            defaultValue="discover"
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
              <TabsTrigger value="discover" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Discover</span>
              </TabsTrigger>
              <TabsTrigger value="playlists" className="flex items-center gap-2">
                <ListMusic className="w-4 h-4" />
                <span>Playlists</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="discover" className="space-y-12">
              <section>
                <div className="max-w-md mx-auto mb-12">
                  <h2 className="text-center text-2xl font-bold mb-6">
                    Find Your Next Favorite Song
                  </h2>
                  <SongSearch 
                    onSelectTrack={setSelectedTrack}
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
            </TabsContent>
            
            <TabsContent value="playlists" className="min-h-[80vh]">
              <PlaylistSection />
            </TabsContent>
            
            <TabsContent value="analytics" className="min-h-[80vh]">
              <AnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </AnimatedTransition>
      </div>
    </Layout>
  );
};

export default Dashboard;
