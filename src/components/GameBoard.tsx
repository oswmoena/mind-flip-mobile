import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import type { ListRenderItem } from 'react-native';
import { Card } from './Card';
import type { CardType } from '../types/game';

// Must match Card's margin value to compute accurate card dimensions.
const CARD_MARGIN = 6;
const BOARD_H_PADDING = 12;
// Caps card growth on tablets so cards don't become comically large.
const MAX_BOARD_WIDTH = 560;

interface GameBoardProps {
  cards: CardType[];
  onCardPress: (index: number) => void;
  numColumns?: number;
  isShuffling?: boolean;
}

// ---------------------------------------------------------------------------
// CardItem — isolated memoized cell.
//
// Keeping the press handler HERE (not in renderItem) is what makes React.memo
// effective: onCardPress is a stable ref from useCallback in the hook, and
// index never changes for a given position, so handlePress is stable too.
// Without this wrapper, every renderItem call would create a new () => ...
// closure, defeating React.memo on Card entirely.
// ---------------------------------------------------------------------------
interface CardItemProps {
  card: CardType;
  index: number;
  onCardPress: (index: number) => void;
  cardWidth: number;
  cardHeight: number;
  isShuffling?: boolean;
}

const CardItem = React.memo(function CardItem({
  card,
  index,
  onCardPress,
  cardWidth,
  cardHeight,
  isShuffling,
}: CardItemProps) {
  const handlePress = useCallback(
    () => onCardPress(index),
    [onCardPress, index],
  );

  return (
    <Card
      card={card}
      onPress={handlePress}
      size={{ width: cardWidth, height: cardHeight }}
      isShuffling={isShuffling}
    />
  );
});

// ---------------------------------------------------------------------------
// GameBoard
// ---------------------------------------------------------------------------
export function GameBoard({
  cards,
  onCardPress,
  numColumns = 4,
  isShuffling,
}: GameBoardProps) {
  const { width: screenWidth } = useWindowDimensions();

  const { cardWidth, cardHeight } = useMemo(() => {
    const boardWidth =
      Math.min(screenWidth, MAX_BOARD_WIDTH) - BOARD_H_PADDING * 2;
    const cw = Math.floor(boardWidth / numColumns) - CARD_MARGIN * 2;
    return { cardWidth: cw, cardHeight: Math.floor(cw * 1.25) };
  }, [screenWidth, numColumns]);

  const renderItem = useCallback<ListRenderItem<CardType>>(
    ({ item, index }) => (
      <CardItem
        card={item}
        index={index}
        onCardPress={onCardPress}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        isShuffling={isShuffling}
      />
    ),
    [onCardPress, cardWidth, cardHeight, isShuffling],
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={cards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        // key forces remount when column count changes (FlatList requires it).
        key={numColumns}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    paddingHorizontal: BOARD_H_PADDING,
    paddingVertical: 8,
  },
  row: {
    justifyContent: 'center',
  },
});
