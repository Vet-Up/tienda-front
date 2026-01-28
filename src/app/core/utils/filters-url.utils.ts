import { Router, ActivatedRoute } from '@angular/router';

export function updateQueryParamsHelper(
  router: Router,
  route: ActivatedRoute,
  page: number,
  searchQuery: string,
  sortSelected: number | null,
  sortOptions: { value: string }[],
  selectedCategoryIds: number[],
  priceRangeFilter: { min: number, max: number } | null
) {
  const queryParams: any = {
    page: page !== 1 ? page : undefined,
    search: searchQuery ? searchQuery : undefined,
    order: sortSelected !== null ? sortOptions[sortSelected].value : undefined,
    categories: selectedCategoryIds.length > 0 ? selectedCategoryIds.join(',') : undefined,
    minPrice: priceRangeFilter ? priceRangeFilter.min : undefined,
    maxPrice: priceRangeFilter ? priceRangeFilter.max : undefined,
  };
  router.navigate([], {
    relativeTo: route,
    queryParams,
    queryParamsHandling: 'merge',
    replaceUrl: true,
  });
}

