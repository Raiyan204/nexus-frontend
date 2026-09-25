import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Line, Circle, G, Text as SvgText } from 'react-native-svg';
import { useStore } from '../store/useStore';
import { useRouter } from 'expo-router';
import FloatingChat from '../components/FloatingChat';

const { width } = Dimensions.get('window');
const HEIGHT = 400;

export default function NetworkGraphScreen() {
  const { contacts, relationships } = useStore();
  const router = useRouter();

  // Simple circle layout for graph nodes
  const nodes = useMemo(() => {
    const radius = 110;
    const centerX = width / 2;
    const centerY = HEIGHT / 2;
    
    return contacts.map((contact, index) => {
      const angle = (index / contacts.length) * 2 * Math.PI;
      return {
        ...contact,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [contacts]);

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <Text className="text-2xl font-bold text-white mb-4 mt-8">Network Map</Text>
      <View className="bg-gray-800 rounded-xl overflow-hidden" style={{ height: HEIGHT }}>
        <Svg width="100%" height="100%">
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
                stroke="#4b5563"
                strokeWidth="2"
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
