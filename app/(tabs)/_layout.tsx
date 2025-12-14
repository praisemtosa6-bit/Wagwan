import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import CreateBottomSheet from '@/components/CreateBottomSheet';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#f0ede4', // Secondary color
          tabBarInactiveTintColor: '#88a8a6', // Dimmed version of secondary
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: '#014743', // Primary color
            borderTopColor: '#013835',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="browse"
          options={{
            title: 'Browse',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="square.grid.2x2.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            tabBarButton: (props) => {
              const { delayLongPress, disabled, ...otherProps } = props;
              return (
                <TouchableOpacity
                  {...(otherProps as any)}
                  delayLongPress={delayLongPress ?? undefined}
                  disabled={disabled ?? undefined}
                  onPress={() => setIsCreateModalVisible(true)}
                  style={{
                    top: -10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: '#015c57', // Slightly lighter than primary
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.30,
                    shadowRadius: 4.65,
                    elevation: 8,
                  }}>
                    <IconSymbol size={30} name="plus" color="#f0ede4" />
                  </View>
                </TouchableOpacity>
              );
            },
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            title: 'Activity',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="bell.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>

      <CreateBottomSheet
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
      />
    </>
  );
}
