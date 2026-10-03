import React, { useState } from 'react';
import { NetworkGraph } from '@/components/NetworkGraph';
import { NodeDetailsPanel } from '@/components/NodeDetailsPanel';
import { View, Text, StyleSheet } from 'react-native';

export default function ExploreScreen() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNodeClick = (node) => {
    setSelectedNodeId(node.id);
  };

  const handleClosePanel = () => {
    setSelectedNodeId(null);
    // Trigger a refresh after possible updates
    setRefreshKey((k) => k + 1);
  };

  return (
    <View style={styles.container}>
      <NetworkGraph key={refreshKey} onNodeClick={handleNodeClick} />
      {selectedNodeId && (
        <NodeDetailsPanel
          selectedNodeId={selectedNodeId}
          onClose={handleClosePanel}
          onSave={handleClosePanel}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
