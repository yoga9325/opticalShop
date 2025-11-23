# TODO: Implement Filters API and Store in Table

## Backend Changes
- [x] Update Product model to include filter fields (gender, frameType, frameShape, color)
- [x] Create Filter entity/model
- [x] Create FilterRepository
- [x] Create FilterService and FilterServiceImpl
- [x] Create FilterController with endpoints to get filters
- [x] Update ProductRepository with filter queries
- [x] Update ProductService to support filtering
- [x] Update ProductController to accept filter parameters
- [x] Create data population script or method to insert filter data into table

## Frontend Changes (Optional, but recommended for dynamic filters)
- [ ] Update ProductService to support filter parameters
- [ ] Update product-list-lenskart component to fetch filters from API
- [ ] Replace static filter constants with API calls

## Testing
- [ ] Test filter API endpoints
- [ ] Test product filtering with new parameters
- [ ] Verify data population
