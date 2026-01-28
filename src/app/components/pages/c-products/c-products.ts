import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CArticleCard } from '../c-article-card/c-article-card';
import { ArticleService } from '../../../core/services/article-service';
import { IArticle } from '../../../core/models/i-article';
import { FormsModule } from '@angular/forms';
import { CPaginator } from '../../ui/c-paginator/c-paginator';
import { ICategory } from '../../../core/models/i-category';
import { CategoryService } from '../../../core/services/category-service';
import { CFiltersSidebar } from '../c-filters-sidebar/c-filters-sidebar';
import { updateQueryParamsHelper } from '../../../core/utils/filters-url.utils';

@Component({
  selector: 'app-c-article',
  imports: [CArticleCard, FormsModule, CPaginator, CFiltersSidebar],
  templateUrl: './c-products.html',
  styleUrl: './c-products.scss',
})
export class CProducts {
  showFiltersSidebar = false;
  articles: IArticle[] = [];
  categories: ICategory[] = [];

  page = 1;
  pageSize = 20;
  totalElements = 0;

  searchQuery = '';
  searchActive = false;

  sortOptions = [
    { label: 'Top Rated', value: 'top-rated' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A-Z', value: 'name-asc' },
    { label: 'Name: Z-A', value: 'name-desc' },
  ];

  sortSelected: number | null = null;
  sortDropdownOpen = false;

  selectedCategoryIds: number[] = [];

  priceRangeFilter: { min: number, max: number } | null = null;

  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.setStateFromQueryParams(params);
      this.loadProducts();
    });
    this.loadCategories();
  }

  loadProducts() {
    this.getProductsObservable().subscribe((data: any) => {
      this.articles = data.data || data;
      this.totalElements = data.totalElements || data.length || 0;
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  private setStateFromQueryParams(params: any) {
    this.page = params['page'] ? +params['page'] : 1;
    this.searchQuery = params['search'] || '';
    const orderValue = params['order'];
    this.sortSelected = orderValue
      ? this.sortOptions.findIndex(opt => opt.value === orderValue)
      : null;
    this.selectedCategoryIds = params['categories']
      ? params['categories'].split(',').map((id: string) => +id)
      : [];
    const minPrice = params['minPrice'] ? +params['minPrice'] : null;
    const maxPrice = params['maxPrice'] ? +params['maxPrice'] : null;
    if (minPrice !== null && maxPrice !== null) {
      this.priceRangeFilter = { min: minPrice, max: maxPrice };
    } else {
      this.priceRangeFilter = null;
    }
  }

  private getProductsObservable() {
    const order =
      this.sortSelected !== null ? this.sortOptions[this.sortSelected].value : undefined;

    if (this.priceRangeFilter) {
      return this.articleService.getProductsByRangePrice(
        this.priceRangeFilter.min,
        this.priceRangeFilter.max,
        this.page,
        this.pageSize,
        order
      );
    }
    if (this.selectedCategoryIds.length > 0) {
      return this.articleService.getProductsByCategories(
        this.selectedCategoryIds,
        this.page,
        this.pageSize,
        order
      );
    }
    if (this.searchQuery.trim()) {
      return this.articleService.searchArticles(
        this.searchQuery.trim(),
        this.page,
        this.pageSize,
        order
      );
    }
    return this.articleService.getProducts(this.page, this.pageSize, order);
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.updateQueryParams();
  }

  onSearchQueryChange() {
    this.page = 1;
    this.updateQueryParams();
  }

  toggleSearch() {
    this.searchActive = !this.searchActive;
  }

  toggleFilters() {
    this.showFiltersSidebar = !this.showFiltersSidebar;
  }

  closeFiltersSidebar() {
    this.showFiltersSidebar = false;
  }

  toggleSortDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.sortDropdownOpen = !this.sortDropdownOpen;
  }

  selectSort(index: number, event: MouseEvent) {
    event.stopPropagation();
    this.sortSelected = index;
    this.sortDropdownOpen = false;
    this.updateQueryParams();
  }

  // Nuevo método para manejar la selección de categorías
  onCategoriesSelected(categoryIds: number[]) {
    this.selectedCategoryIds = categoryIds;
    this.page = 1;
    this.updateQueryParams();
  }

  onPriceRangeSelected(range: { min: number, max: number }) {
    this.priceRangeFilter = range;
    this.page = 1;
    this.updateQueryParams();
  }

  get hasActiveFilters(): boolean {
    return (
      this.selectedCategoryIds.length > 0 ||
      this.searchQuery.trim().length > 0 ||
      this.sortSelected !== null ||
      (this.priceRangeFilter !== null && (this.priceRangeFilter.min !== 0 || this.priceRangeFilter.max !== 60))
    );
  }

  clearAllFilters() {
    this.selectedCategoryIds = [];
    this.searchQuery = '';
    this.sortSelected = null;
    this.priceRangeFilter = null;
    this.page = 1;
    this.updateQueryParams();
  }

  updateQueryParams() {
    updateQueryParamsHelper(
      this.router,
      this.route,
      this.page,
      this.searchQuery,
      this.sortSelected,
      this.sortOptions,
      this.selectedCategoryIds,
      this.priceRangeFilter
    );
  }
}
