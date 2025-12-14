"use client";

import { useState, startTransition } from "react";
import { toggleFavorite } from "@/lib/dbActions";
import { Button } from "react-bootstrap";

interface Props {
  recipeId: number;
  userId: number;
  isFavorited: boolean;
  className?: string;
}

export default function FavoriteButton({ recipeId, userId, isFavorited, className }: Props) {
  const [favorited, setFavorited] = useState(isFavorited);

  async function handleClick() {
    startTransition(async () => {
      const result = await toggleFavorite(userId, recipeId);
      setFavorited(result.favorited);
    });
  }

  return (
    <Button
      variant={favorited ? "danger" : "outline-danger"}
      onClick={handleClick}
      className={className}
    >
      {favorited ? "♥ Favorited" : "♡ Favorite"}
    </Button>
  );
}