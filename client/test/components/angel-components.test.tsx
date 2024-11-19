// import React from "react";
// import { shallow, mount } from "enzyme";
// import { MemoryRouter as Router } from "react-router-dom";
// import { MasterList, AngelDetails, AngelNew, AngelHistory, AngelEdit,} from "../../src/components/angel-components";
// import AngelService from "../../src/services/angel-service";
// import SeriesService from "../../src/services/series-service";
// import LikesService from "../../src/services/likes-service";
// import WishlistService from "../../src/services/wishlist-service";
// import Cookies from "js-cookie";

// jest.mock("../../src/services/angel-service");
// jest.mock("../../src/services/series-service");
// jest.mock("../../src/services/likes-service");
// jest.mock("../../src/services/wishlist-service");
// jest.mock("js-cookie");

// describe("Angel Components Tests", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("MasterList Tests", () => {
//     test("MasterList renders grouped angels correctly", async () => {
//       AngelService.getAll.mockResolvedValue([
//         { angel_id: 1, name: "Angel A", series_id: 1 },
//         { angel_id: 2, name: "Angel B", series_id: 2 },
//       ]);

//       const wrapper = mount(
//         <Router>
//           <MasterList />
//         </Router>
//       );

//       await new Promise(setImmediate); // Wait for async operations
//       wrapper.update();

//       expect(wrapper.find(".angel-group").length).toBe(2);
//       expect(wrapper.find(".angel-link").at(0).text()).toBe("Angel A");
//       expect(wrapper.find(".angel-link").at(1).text()).toBe("Angel B");
//     });

//     test("MasterList handles fetch errors gracefully", async () => {
//       AngelService.getAll.mockRejectedValue(new Error("Failed to fetch angels"));

//       const wrapper = mount(
//         <Router>
//           <MasterList />
//         </Router>
//       );

//       await new Promise(setImmediate); // Wait for async operations
//       wrapper.update();

//       expect(wrapper.text()).toContain("Error fetching angels");
//     });
//   });

//   describe("AngelDetails Tests", () => {
//     test("AngelDetails renders correctly with angel data", async () => {
//       AngelService.get.mockResolvedValue({
//         angel_id: 1,
//         name: "Angel A",
//         description: "Test description",
//         series_id: 1,
//         views: 5,
//         image: "https://example.com/image.jpg",
//       });
//       SeriesService.getName.mockResolvedValue("Test Series");
//       LikesService.getUserLikes.mockResolvedValue([]);
//       WishlistService.getUserWishlist.mockResolvedValue([]);

//       const wrapper = mount(
//         <Router>
//           <AngelDetails />
//         </Router>
//       );

//       await new Promise(setImmediate); // Wait for async operations
//       wrapper.update();

//       expect(wrapper.find(".angel-header").text()).toBe("Angel A");
//       expect(wrapper.find(".detail-row").at(0).text()).toContain("Test Series");
//       expect(wrapper.find(".angel-image").prop("src")).toBe("https://example.com/image.jpg");
//     });

//     test("AngelDetails handles errors gracefully", async () => {
//       AngelService.get.mockRejectedValue(new Error("Error fetching angel"));

//       const wrapper = mount(
//         <Router>
//           <AngelDetails />
//         </Router>
//       );

//       await new Promise(setImmediate); // Wait for async operations
//       wrapper.update();

//       expect(wrapper.text()).toContain("Error fetching angel");
//     });
//   });

//   describe("AngelNew Tests", () => {
//     test("AngelNew renders and allows creating a new angel", async () => {
//       SeriesService.getAll.mockResolvedValue([
//         { series_id: 1, name: "Series A" },
//         { series_id: 2, name: "Series B" },
//       ]);
//       AngelService.createAngel.mockResolvedValue({ angel_id: 1 });

//       const wrapper = mount(
//         <Router>
//           <AngelNew />
//         </Router>
//       );

//       await new Promise(setImmediate); // Wait for async operations
//       wrapper.update();

//       wrapper.find('input[name="name"]').simulate("change", { target: { value: "New Angel", name: "name" } });
//       wrapper.find('textarea[name="description"]').simulate("change", { target: { value: "Description", name: "description" } });
//       wrapper.find('input[name="image"]').simulate("change", { target: { value: "https://example.com/image.jpg", name: "image" } });
//       wrapper.find('input[name="release_year"]').simulate("change", { target: { value: 2023, name: "release_year" } });

//       wrapper.find(".btn-create").simulate("click");

//       await new Promise(setImmediate); // Wait for async operations
//       expect(AngelService.createAngel).toHaveBeenCalled();
//     });
//   });

//   describe("AngelHistory Tests", () => {
//     test("AngelHistory renders history entries correctly", async () => {
//       AngelService.getAngelHistory.mockResolvedValue([
//         {
//           angelhistory_id: 1,
//           description: "First update",
//           user_id: 1,
//           updated_at: "2023-01-01T00:00:00Z",
//         },
//       ]);

//       const wrapper = mount(
//         <Router>
//           <AngelHistory />
//         </Router>
//       );

//       await new Promise(setImmediate); // Wait for async operations
//       wrapper.update();

//       expect(wrapper.find(".history-entry").length).toBe(1);
//       expect(wrapper.text()).toContain("First update");
//       expect(wrapper.text()).toContain("2023");
//     });

//     test("AngelHistory handles empty history gracefully", async () => {
//       AngelService.getAngelHistory.mockResolvedValue([]);

//       const wrapper = mount(
//         <Router>
//           <AngelHistory />
//         </Router>
//       );

//       await new Promise(setImmediate); // Wait for async operations
//       wrapper.update();

//       expect(wrapper.text()).toContain("No history available for this angel");
//     });
//   });

//   describe("AngelEdit Tests", () => {
//     test("AngelEdit renders and allows editing an angel", async () => {
//       AngelService.get.mockResolvedValue({
//         angel_id: 1,
//         name: "Angel A",
//         description: "Old description",
//         series_id: 1,
//         image: "https://example.com/image.jpg",
//         release_year: 2020,
//       });
//       SeriesService.getAll.mockResolvedValue([
//         { series_id: 1, name: "Series A" },
//         { series_id: 2, name: "Series B" },
//       ]);

//       const wrapper = mount(
//         <Router>
//           <AngelEdit />
//         </Router>
//       );

//       await new Promise(setImmediate); // Wait for async operations
//       wrapper.update();

//       wrapper.find('input[name="name"]').simulate("change", { target: { value: "Updated Angel", name: "name" } });
//       wrapper.find(".save-button").simulate("click");

//       expect(AngelService.updateAngel).toHaveBeenCalledWith(
//         expect.objectContaining({ name: "Updated Angel" })
//       );
//     });

//     test("AngelEdit handles delete angel functionality", async () => {
//       AngelService.get.mockResolvedValue({
//         angel_id: 1,
//         name: "Angel A",
//         description: "Old description",
//         series_id: 1,
//         image: "https://example.com/image.jpg",
//         release_year: 2020,
//       });

//       const wrapper = mount(
//         <Router>
//           <AngelEdit />
//         </Router>
//       );

//       await new Promise(setImmediate); // Wait for async operations
//       wrapper.update();

//       wrapper.find(".delete-button").simulate("click");

//       expect(AngelService.deleteAngel).toHaveBeenCalledWith(1);
//     });
//   });
// });
