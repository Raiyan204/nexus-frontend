import React, { useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import Svg, { Line, Circle, G, Text as SvgText, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useStore } from '../store/useStore';
import { useRouter } from 'expo-router';
import FloatingChat from '../components/FloatingChat';

export default function NetworkGraphScreen() {
  const { contacts, relationships } = useStore();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  // Make the graph fill the available space beautifully
  const graphHeight = Math.max(height - 150, 400);

  // Simple circle layout for graph nodes
  const nodes = useMemo(() => {
    const radius = Math.min(width, graphHeight) / 2.5;
    const centerX = width / 2;
    const centerY = graphHeight / 2;
    
    return contacts.map((contact, index) => {
      const angle = (index / contacts.length) * 2 * Math.PI;
      return {
        ...contact,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [contacts, width, graphHeight]);

  return (
    <View className="flex-1 bg-[#0B0F19] p-4">
      <View className="flex-row justify-between items-center mb-4 mt-8 px-2">
        <Text className="text-3xl font-extrabold text-white tracking-tight">Network Map</Text>
        <Text className="text-gray-400 text-sm font-semibold tracking-widest uppercase">{contacts.length} Nodes</Text>
      </View>
      <View className="bg-[#111827] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl" style={{ height: graphHeight }}>
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#0B0F19" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          
          {/* Draw Edges (Relationships) */}
          {relationships.map((rel) => {
            const sourceNode = nodes.find(n => n.id === rel.sourcePerson?.id);
            const targetNode = nodes.find(n => n.id === rel.targetPerson?.id);
            if (!sourceNode || !targetNode) return null;
            return (
              <Line
                key={rel.id}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke="#374151"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            );
          })}
          
          {/* Draw Nodes (Contacts) */}
          {nodes.map((node) => (
            <G key={node.id} x={node.x} y={node.y} onPress={() => router.push(`/contact/${node.id}`)}>
              <Circle r="26" fill="#374151" stroke="#60a5fa" strokeWidth="2" />
              <SvgText
                fill="#ffffff"
                fontSize="14"
                fontWeight="bold"
                x="0"
                y="5"
                textAnchor="middle"
              >
                {node.firstName?.[0] || ''}{node.lastName?.[0] || ''}
              </SvgText>
              
              {/* Render Badges as small colored dots below the node */}
              {node.badges && node.badges.map((badge, idx) => (
                <Circle
                  key={badge.id}
                  r="4"
                  cx={-10 + idx * 10}
                  cy="34"
                  fill={badge.colorHex}
                />
              ))}
            </G>
          ))}
        </Svg>
      </View>
      <FloatingChat />
    </View>
  );
}
