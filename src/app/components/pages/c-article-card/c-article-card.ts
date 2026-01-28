import { Component, Input } from '@angular/core';
import { IArticle } from '../../../core/models/i-article';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-c-article-card',
  imports: [RouterLink,CommonModule],
  templateUrl: './c-article-card.html',
  styleUrl: './c-article-card.scss',
})
export class CArticleCard {
  @Input() product!: IArticle;
  @Input() categories: { categoryId: number; name: string }[] = [];


  getCategoryName(categoryId: number): string {
    const cat = this.categories.find((c) => c.categoryId === categoryId);
    return cat ? cat.name : '';
  }

}
