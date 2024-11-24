

import React from "react";
import { mount } from "enzyme";
import { MemoryRouter as Router } from "react-router-dom";
import { MasterList, AngelDetails, AngelNew, AngelEdit, AngelHistory } from "../../src/components/angel-components";
import AngelService from "../../src/services/angel-service";
import SeriesService from "../../src/services/series-service";
import Cookies from "js-cookie";


jest.mock("../../src/services/angel-service");
jest.mock("../../src/services/series-service");
jest.mock("js-cookie");

describe("Angel Components Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
describe("Angel Components Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("MasterList Component", () => {
    test("renders and fetches angels", async () => {
      const mockAngels = [
        { angel_id: 1, name: "Angel A", series_id: 1 },
        { angel_id: 2, name: "Angel B", series_id: 1 },
      ];
      
      (AngelService.getAll as jest.Mock).mockResolvedValue(mockAngels);

      await act(async () => {
        const wrapper = mount(
          <Router>
            <AngelEdit />
          </Router>
        );
      
        await waitForAsyncUpdates();
        wrapper.update();
      })

      await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async state updates
      wrapper.update();

      expect(wrapper.find(".angel-master-list").exists()).toBe(true);
      expect(wrapper.find(".angel-link").length).toBe(2);
      expect(wrapper.find(".angel-link").at(0).text()).toBe("Angel A");
      expect(wrapper.find(".angel-link").at(1).text()).toBe("Angel B");
    });

    test("shows error message on fetch failure", async () => {
      (AngelService.getAll as jest.Mock).mockRejectedValue(new Error("Failed to fetch angels"));
    test("shows error message on fetch failure", async () => {
      (AngelService.getAll as jest.Mock).mockRejectedValue(new Error("Failed to fetch angels"));

      const wrapper = mount(
        <Router>
          <MasterList />
        </Router>
      );
      const wrapper = mount(
        <Router>
          <MasterList />
        </Router>
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();

      expect(wrapper.find(".error-message").text()).toBe("Error fetching angels: Failed to fetch angels");
    });
  });
      expect(wrapper.find(".error-message").text()).toBe("Error fetching angels: Failed to fetch angels");
    });
  });

describe("AngelDetails Component", () => {
    test("renders and fetches angel details", async () => {
      const mockAngel = { angel_id: 1, name: "Angel A", description: "An angel", series_id: 1, views: 10 };
      const mockSeriesName = "Series 1";
      (AngelService.get as jest.Mock).mockResolvedValue(mockAngel);
      (SeriesService.getName as jest.Mock).mockResolvedValue(mockSeriesName);

      const wrapper = mount(
        <Router>
          <AngelDetails />
        </Router>
      );
describe("AngelDetails Component", () => {
    test("renders and fetches angel details", async () => {
      const mockAngel = { angel_id: 1, name: "Angel A", description: "An angel", series_id: 1, views: 10 };
      const mockSeriesName = "Series 1";
      (AngelService.get as jest.Mock).mockResolvedValue(mockAngel);
      (SeriesService.getName as jest.Mock).mockResolvedValue(mockSeriesName);

      const wrapper = mount(
        <Router>
          <AngelDetails />
        </Router>
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();

      expect(wrapper.find(".angel-header").text()).toBe("Angel A");
      expect(wrapper.find(".detail-row").at(1).text()).toContain("An angel");
      expect(wrapper.find(".detail-row").at(2).text()).toContain("10");
    });
      expect(wrapper.find(".angel-header").text()).toBe("Angel A");
      expect(wrapper.find(".detail-row").at(1).text()).toContain("An angel");
      expect(wrapper.find(".detail-row").at(2).text()).toContain("10");
    });

    test("shows error message on fetch failure", async () => {
      (AngelService.get as jest.Mock).mockRejectedValue(new Error("Failed to fetch angel details"));
    test("shows error message on fetch failure", async () => {
      (AngelService.get as jest.Mock).mockRejectedValue(new Error("Failed to fetch angel details"));

      const wrapper = mount(
        <Router>
          <AngelDetails />
        </Router>
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();

      const errorMessage = wrapper.find(".error-message");
      expect(errorMessage.exists()).toBe(true);
      expect(wrapper.find(".error-message").text()).toBe("Error fetching angel: Failed to fetch angel details");
    });
  });
      const wrapper = mount(
        <Router>
          <AngelDetails />
        </Router>
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();

      const errorMessage = wrapper.find(".error-message");
      expect(errorMessage.exists()).toBe(true);
      expect(wrapper.find(".error-message").text()).toBe("Error fetching angel: Failed to fetch angel details");
    });
  });

describe("AngelNew Component", () => {
    test("renders and submits a new angel", async () => {
      const mockSeriesList = [{ series_id: 1, name: "Series 1" }];
      (SeriesService.getAll as jest.Mock).mockResolvedValue(mockSeriesList);
      (AngelService.createAngel as jest.Mock).mockResolvedValue({ angel_id: 1 });
describe("AngelNew Component", () => {
    test("renders and submits a new angel", async () => {
      const mockSeriesList = [{ series_id: 1, name: "Series 1" }];
      (SeriesService.getAll as jest.Mock).mockResolvedValue(mockSeriesList);
      (AngelService.createAngel as jest.Mock).mockResolvedValue({ angel_id: 1 });

      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: "admin", role: "admin", user_id: 123 }));

      const wrapper = mount(
        <Router>
          <AngelNew />
        </Router>
      );
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: "admin", role: "admin", user_id: 123 }));

      const wrapper = mount(
        <Router>
          <AngelNew />
        </Router>
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();

      wrapper.find('input[name="name"]').simulate("change", { target: { name: "name", value: "New Angel" } });
      wrapper.find('select[name="series_id"]').simulate("change", { target: { value: "1" } });
      wrapper.find('textarea[name="description"]').simulate("change", { target: { name: "description", value: "Description" } });
      wrapper.find('input[name="release_year"]').simulate("change", { target: { name: "release_year", value: "2024" } });

      wrapper.find(".btn-create").simulate("click");

      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();

      expect(AngelService.createAngel).toHaveBeenCalledWith({
        angel_id: 0,
        name: "New Angel",
        description: "Description",
        image: "",
        release_year: 2024,
        views: 0,
        user_id: 123,
        series_id: 1,
      });
    });


    test("shows error when creating a new angel fails", async () => {
        const mockSeriesList = [{ series_id: 1, name: "Series 1" }];
        (SeriesService.getAll as jest.Mock).mockResolvedValue(mockSeriesList);
        (AngelService.createAngel as jest.Mock).mockRejectedValue(new Error("Failed to create angel"));
    
        (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: "admin", role: "admin", user_id: 123 }));
    
        const wrapper = mount(
            <Router>
                <AngelNew />
            </Router>
        );
    
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
    
        wrapper.find('input[name="name"]').simulate("change", { target: { name: "name", value: "New Angel" } });
        wrapper.find('select[name="series_id"]').simulate("change", { target: { value: "1" } });
        wrapper.find(".btn-create").simulate("click");
    
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
    
        expect(wrapper.find(".error-message").exists()).toBe(true);
        expect(wrapper.find(".error-message").text()).toBe("Error creating angel: Failed to create angel");
    });

    test('shows validation error if required fields are empty', async () => {
        const mockSeriesList = [{ series_id: 1, name: 'Series 1' }];
        (SeriesService.getAll as jest.Mock).mockResolvedValue(mockSeriesList);
        (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: "admin", role: "admin", user_id: 123 }));
      
        const wrapper = mount(
          <Router>
            <AngelNew />
          </Router>
        );
      
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
      
        wrapper.find(".btn-create").simulate("click");
      
        expect(wrapper.find(".error-message").exists()).toBe(true);
        expect(wrapper.find(".error-message").text()).toContain('Name and Series are required');
      });
      
  });

describe('AngelEdit Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('renders and fetches angel details', async () => {
      const mockAngel = {
        angel_id: 1,
        name: 'Angel A',
        description: 'Description',
        image: 'https://example.com/image.png',
        series_id: 1,
        release_year: 2024,
        views: 100,
        user_id: 1,
      };
      const mockSeriesList = [{ series_id: 1, name: 'Series 1' }];
  
      (AngelService.get as jest.Mock).mockResolvedValueOnce(mockAngel);
      (SeriesService.getAll as jest.Mock).mockResolvedValueOnce(mockSeriesList);
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'admin', role: 'admin', user_id: 123 }));
  
      const wrapper = mount(
        <Router>
          <AngelEdit />
        </Router>
      );
  
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
  
      // Assertions
      expect(wrapper.find('input[name="name"]').prop('value')).toBe(mockAngel.name);
      expect(wrapper.find('textarea[name="description"]').prop('value')).toBe(mockAngel.description);
      expect(wrapper.find('input[name="release_year"]').prop('value')).toBe(mockAngel.release_year);
      expect(wrapper.find('select[name="series_id"]').prop('value')).toBe(mockAngel.series_id);
    });
  
    test('updates and saves an angel', async () => {
      const mockAngel = {
        angel_id: 1,
        name: 'Angel A',
        description: 'Description',
        image: 'https://example.com/image.png',
        series_id: 1,
        release_year: 2024,
        views: 100,
        user_id: 1,
      };
      const mockSeriesList = [{ series_id: 1, name: 'Series 1' }];
  
      (AngelService.get as jest.Mock).mockResolvedValueOnce(mockAngel);
      (SeriesService.getAll as jest.Mock).mockResolvedValueOnce(mockSeriesList);
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'admin', role: 'admin', user_id: 123 }));
      (AngelService.updateAngel as jest.Mock).mockResolvedValueOnce({ ...mockAngel, name: 'Updated Angel' });
  
      const wrapper = mount(
        <Router>
          <AngelEdit />
        </Router>
      );
  
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
  
      // Simulate input change
      wrapper.find('input[name="name"]').simulate('change', { target: { name: 'name', value: 'Updated Angel' } });
      wrapper.find('.save-button').simulate('click');
  
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
  
      // Assertions
      expect(AngelService.updateAngel).toHaveBeenCalledWith({
        ...mockAngel,
        name: 'Updated Angel',
      });
    });
  
    test('shows access denied for non-admin users', async () => {
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'user', role: 'user', user_id: 456 }));
  
      const wrapper = mount(
        <Router>
          <AngelEdit />
        </Router>
      );
  
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
  
      // Assertions
      expect(wrapper.find('.access-denied').exists()).toBe(true);
      expect(wrapper.find('.access-denied').text()).toContain('Access Denied');
    });
  
    test('shows error message on fetch failure', async () => {
      (AngelService.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch angel details'));
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'admin', role: 'admin', user_id: 123 }));
  
      const wrapper = mount(
        <Router>
          <AngelEdit />
        </Router>
      );
  
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
      
      console.log(wrapper.debug());
      // Assertions
      expect(wrapper.find('.error-message').exists()).toBe(true);
      expect(wrapper.find('.error-message').text()).toBe('Error fetching angel details: Failed to fetch angel details');
    });

    test('renders access denied if user is not admin', async () => {
        (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'user', role: 'user', user_id: 456 }));
      
        const wrapper = mount(
          <Router>
            <AngelEdit />
          </Router>
        );
      
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
      
        expect(wrapper.find('.access-denied').exists()).toBe(true);
        expect(wrapper.find('.access-denied').text()).toContain('Access Denied');
    });

    test('shows error message when series fetching fails', async () => {
        (SeriesService.getAll as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch series'));
        (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'admin', role: 'admin', user_id: 123 }));
      
        const wrapper = mount(
          <Router>
            <AngelEdit />
          </Router>
        );
      
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
      
        expect(wrapper.find('.error-message').exists()).toBe(true);
        expect(wrapper.find('.error-message').text()).toBe('Error fetching series: Failed to fetch series');
    });

    test('updates input fields correctly', async () => {
        const mockAngel = {
          angel_id: 1,
          name: 'Angel A',
          description: 'Description',
          image: 'https://example.com/image.png',
          series_id: 1,
          release_year: 2024,
          views: 100,
          user_id: 1,
        };
        (AngelService.get as jest.Mock).mockResolvedValueOnce(mockAngel);
        (SeriesService.getAll as jest.Mock).mockResolvedValueOnce([{ series_id: 1, name: 'Series 1' }]);
        (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'admin', role: 'admin', user_id: 123 }));
      
        const wrapper = mount(
          <Router>
            <AngelEdit />
          </Router>
        );
      
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
      
        wrapper.find('input[name="name"]').simulate('change', { target: { name: 'name', value: 'Updated Angel' } });
        wrapper.find('textarea[name="description"]').simulate('change', { target: { name: 'description', value: 'Updated Description' } });
      
        expect(wrapper.find('input[name="name"]').prop('value')).toBe('Updated Angel');
        expect(wrapper.find('textarea[name="description"]').prop('value')).toBe('Updated Description');
    });

      test('deletes an angel', async () => {
        const mockAngel = {
          angel_id: 1,
          name: 'Angel A',
          description: 'Description',
          image: 'https://example.com/image.png',
          series_id: 1,
          release_year: 2024,
          views: 100,
          user_id: 1,
        };
        (AngelService.get as jest.Mock).mockResolvedValueOnce(mockAngel);
        (AngelService.deleteAngel as jest.Mock).mockResolvedValueOnce({});
        (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'admin', role: 'admin', user_id: 123 }));
      
        const wrapper = mount(
          <Router>
            <AngelEdit />
          </Router>
        );
      
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
      
        wrapper.find('.delete-button').simulate('click');
      
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
      
        expect(AngelService.deleteAngel).toHaveBeenCalledWith(1);
    });
  });
});

describe("AngelHistory Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders and fetches angel history", async () => {
    const mockHistory = [
      {
        angelhistory_id: 1,
        description: "First update",
        user_id: "123",
        updated_at: "2024-01-01T12:00:00Z",
      },
      {
        angelhistory_id: 2,
        description: "Second update",
        user_id: "456",
        updated_at: "2024-02-01T15:30:00Z",
      },
    ];

    (AngelService.getAngelHistory as jest.Mock).mockResolvedValueOnce(mockHistory);

    const wrapper = mount(
      <Router initialEntries={["/angelhistory/1"]}>
        <AngelHistory />
      </Router>
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper.find(".angel-history").exists()).toBe(true);
    expect(wrapper.find(".history-entry").length).toBe(2);

    expect(wrapper.find(".history-entry").at(0).text()).toContain("First update");
    expect(wrapper.find(".history-entry").at(0).text()).toContain("123");
    expect(wrapper.find(".history-entry").at(0).text()).toContain("01/01/2024, 12:00:00 PM");

    expect(wrapper.find(".history-entry").at(1).text()).toContain("Second update");
    expect(wrapper.find(".history-entry").at(1).text()).toContain("456");
    expect(wrapper.find(".history-entry").at(1).text()).toContain("02/01/2024, 3:30:00 PM");
  });

  test("shows no history available message if no history exists", async () => {
    (AngelService.getAngelHistory as jest.Mock).mockResolvedValueOnce([]);

    const wrapper = mount(
      <Router initialEntries={["/angelhistory/1"]}>
        <AngelHistory />
      </Router>
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper.find(".angel-history").exists()).toBe(true);
    expect(wrapper.find(".history-list").text()).toContain("No history available for this angel.");
  });

  test("shows error message on fetch failure", async () => {
    (AngelService.getAngelHistory as jest.Mock).mockRejectedValueOnce(new Error("Failed to fetch"));

    const wrapper = mount(
      <Router initialEntries={["/angelhistory/1"]}>
        <AngelHistory />
      </Router>
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper.find(".error-message").exists()).toBe(true);
    expect(wrapper.find(".error-message").text()).toBe("Failed to fetch angel history");
  });

  test("navigates back to angel details", async () => {
    const mockHistory = [
      {
        angelhistory_id: 1,
        description: "First update",
        user_id: "123",
        updated_at: "2024-01-01T12:00:00Z",
      },
    ];

    (AngelService.getAngelHistory as jest.Mock).mockResolvedValueOnce(mockHistory);

    const mockHistoryPush = jest.fn();
    jest.spyOn(require("react-router-dom"), "useHistory").mockReturnValue({ push: mockHistoryPush });

    const wrapper = mount(
      <Router initialEntries={["/angelhistory/1"]}>
        <AngelHistory />
      </Router>
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    wrapper.find(".back-button").simulate("click");
      wrapper.find('input[name="name"]').simulate("change", { target: { name: "name", value: "New Angel" } });
      wrapper.find('select[name="series_id"]').simulate("change", { target: { value: "1" } });
      wrapper.find('textarea[name="description"]').simulate("change", { target: { name: "description", value: "Description" } });
      wrapper.find('input[name="release_year"]').simulate("change", { target: { name: "release_year", value: "2024" } });

      wrapper.find(".btn-create").simulate("click");

      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();

      expect(AngelService.createAngel).toHaveBeenCalledWith({
        angel_id: 0,
        name: "New Angel",
        description: "Description",
        image: "",
        release_year: 2024,
        views: 0,
        user_id: 123,
        series_id: 1,
      });
    });


    test("shows error when creating a new angel fails", async () => {
        const mockSeriesList = [{ series_id: 1, name: "Series 1" }];
        (SeriesService.getAll as jest.Mock).mockResolvedValue(mockSeriesList);
        (AngelService.createAngel as jest.Mock).mockRejectedValue(new Error("Failed to create angel"));
    
        (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: "admin", role: "admin", user_id: 123 }));
    
        const wrapper = mount(
            <Router>
                <AngelNew />
            </Router>
        );
    
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
    
        wrapper.find('input[name="name"]').simulate("change", { target: { name: "name", value: "New Angel" } });
        wrapper.find('select[name="series_id"]').simulate("change", { target: { value: "1" } });
        wrapper.find(".btn-create").simulate("click");
    
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
    
        expect(wrapper.find(".error-message").exists()).toBe(true);
        expect(wrapper.find(".error-message").text()).toBe("Error creating angel: Failed to create angel");
    });

    test('shows validation error if required fields are empty', async () => {
        const mockSeriesList = [{ series_id: 1, name: 'Series 1' }];
        (SeriesService.getAll as jest.Mock).mockResolvedValue(mockSeriesList);
        (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: "admin", role: "admin", user_id: 123 }));
      
        const wrapper = mount(
          <Router>
            <AngelNew />
          </Router>
        );
      
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
      
        wrapper.find(".btn-create").simulate("click");
      
        expect(wrapper.find(".error-message").exists()).toBe(true);
        expect(wrapper.find(".error-message").text()).toContain('Name and Series are required');
      });
      
  });

describe('AngelEdit Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('renders and fetches angel details', async () => {
      const mockAngel = {
        angel_id: 1,
        name: 'Angel A',
        description: 'Description',
        image: 'https://example.com/image.png',
        series_id: 1,
        release_year: 2024,
        views: 100,
        user_id: 1,
      };
      const mockSeriesList = [{ series_id: 1, name: 'Series 1' }];
  
      (AngelService.get as jest.Mock).mockResolvedValueOnce(mockAngel);
      (SeriesService.getAll as jest.Mock).mockResolvedValueOnce(mockSeriesList);
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'admin', role: 'admin', user_id: 123 }));
  
      const wrapper = mount(
        <Router>
          <AngelEdit />
        </Router>
      );
  
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
  
      // Assertions
      expect(wrapper.find('input[name="name"]').prop('value')).toBe(mockAngel.name);
      expect(wrapper.find('textarea[name="description"]').prop('value')).toBe(mockAngel.description);
      expect(wrapper.find('input[name="release_year"]').prop('value')).toBe(mockAngel.release_year);
      expect(wrapper.find('select[name="series_id"]').prop('value')).toBe(mockAngel.series_id);
    });
  
    test('updates and saves an angel', async () => {
      const mockAngel = {
        angel_id: 1,
        name: 'Angel A',
        description: 'Description',
        image: 'https://example.com/image.png',
        series_id: 1,
        release_year: 2024,
        views: 100,
        user_id: 1,
      };
      const mockSeriesList = [{ series_id: 1, name: 'Series 1' }];
  
      (AngelService.get as jest.Mock).mockResolvedValueOnce(mockAngel);
      (SeriesService.getAll as jest.Mock).mockResolvedValueOnce(mockSeriesList);
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'admin', role: 'admin', user_id: 123 }));
      (AngelService.updateAngel as jest.Mock).mockResolvedValueOnce({ ...mockAngel, name: 'Updated Angel' });
  
      const wrapper = mount(
        <Router>
          <AngelEdit />
        </Router>
      );
  
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
  
      // Simulate input change
      wrapper.find('input[name="name"]').simulate('change', { target: { name: 'name', value: 'Updated Angel' } });
      wrapper.find('.save-button').simulate('click');
  
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
  
      // Assertions
      expect(AngelService.updateAngel).toHaveBeenCalledWith({
        ...mockAngel,
        name: 'Updated Angel',
      });
    });
  
    test('shows access denied for non-admin users', async () => {
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'user', role: 'user', user_id: 456 }));
  
      const wrapper = mount(
        <Router>
          <AngelEdit />
        </Router>
      );
  
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
  
      // Assertions
      expect(wrapper.find('.access-denied').exists()).toBe(true);
      expect(wrapper.find('.access-denied').text()).toContain('Access Denied');
    });
  
    test('shows error message on fetch failure', async () => {
      (AngelService.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch angel details'));
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'admin', role: 'admin', user_id: 123 }));
  
      const wrapper = mount(
        <Router>
          <AngelEdit />
        </Router>
      );
  
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
      
      console.log(wrapper.debug());
      // Assertions
      expect(wrapper.find('.error-message').exists()).toBe(true);
      expect(wrapper.find('.error-message').text()).toBe('Error fetching angel details: Failed to fetch angel details');
    });

    test('renders access denied if user is not admin', async () => {
        (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'user', role: 'user', user_id: 456 }));
      
        const wrapper = mount(
          <Router>
            <AngelEdit />
          </Router>
        );
      
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
      
        expect(wrapper.find('.access-denied').exists()).toBe(true);
        expect(wrapper.find('.access-denied').text()).toContain('Access Denied');
    });

    test('shows error message when series fetching fails', async () => {
        (SeriesService.getAll as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch series'));
        (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'admin', role: 'admin', user_id: 123 }));
      
        const wrapper = mount(
          <Router>
            <AngelEdit />
          </Router>
        );
      
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
      
        expect(wrapper.find('.error-message').exists()).toBe(true);
        expect(wrapper.find('.error-message').text()).toBe('Error fetching series: Failed to fetch series');
    });

    test('updates input fields correctly', async () => {
        const mockAngel = {
          angel_id: 1,
          name: 'Angel A',
          description: 'Description',
          image: 'https://example.com/image.png',
          series_id: 1,
          release_year: 2024,
          views: 100,
          user_id: 1,
        };
        (AngelService.get as jest.Mock).mockResolvedValueOnce(mockAngel);
        (SeriesService.getAll as jest.Mock).mockResolvedValueOnce([{ series_id: 1, name: 'Series 1' }]);
        (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'admin', role: 'admin', user_id: 123 }));
      
        const wrapper = mount(
          <Router>
            <AngelEdit />
          </Router>
        );
      
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
      
        wrapper.find('input[name="name"]').simulate('change', { target: { name: 'name', value: 'Updated Angel' } });
        wrapper.find('textarea[name="description"]').simulate('change', { target: { name: 'description', value: 'Updated Description' } });
      
        expect(wrapper.find('input[name="name"]').prop('value')).toBe('Updated Angel');
        expect(wrapper.find('textarea[name="description"]').prop('value')).toBe('Updated Description');
    });

      test('deletes an angel', async () => {
        const mockAngel = {
          angel_id: 1,
          name: 'Angel A',
          description: 'Description',
          image: 'https://example.com/image.png',
          series_id: 1,
          release_year: 2024,
          views: 100,
          user_id: 1,
        };
        (AngelService.get as jest.Mock).mockResolvedValueOnce(mockAngel);
        (AngelService.deleteAngel as jest.Mock).mockResolvedValueOnce({});
        (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'admin', role: 'admin', user_id: 123 }));
      
        const wrapper = mount(
          <Router>
            <AngelEdit />
          </Router>
        );
      
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
      
        wrapper.find('.delete-button').simulate('click');
      
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
      
        expect(AngelService.deleteAngel).toHaveBeenCalledWith(1);
    });
  });
});

describe("AngelHistory Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders and fetches angel history", async () => {
    const mockHistory = [
      {
        angelhistory_id: 1,
        description: "First update",
        user_id: "123",
        updated_at: "2024-01-01T12:00:00Z",
      },
      {
        angelhistory_id: 2,
        description: "Second update",
        user_id: "456",
        updated_at: "2024-02-01T15:30:00Z",
      },
    ];

    (AngelService.getAngelHistory as jest.Mock).mockResolvedValueOnce(mockHistory);

    const wrapper = mount(
      <Router initialEntries={["/angelhistory/1"]}>
        <AngelHistory />
      </Router>
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper.find(".angel-history").exists()).toBe(true);
    expect(wrapper.find(".history-entry").length).toBe(2);

    expect(wrapper.find(".history-entry").at(0).text()).toContain("First update");
    expect(wrapper.find(".history-entry").at(0).text()).toContain("123");
    expect(wrapper.find(".history-entry").at(0).text()).toContain("01/01/2024, 12:00:00 PM");

    expect(wrapper.find(".history-entry").at(1).text()).toContain("Second update");
    expect(wrapper.find(".history-entry").at(1).text()).toContain("456");
    expect(wrapper.find(".history-entry").at(1).text()).toContain("02/01/2024, 3:30:00 PM");
  });

  test("shows no history available message if no history exists", async () => {
    (AngelService.getAngelHistory as jest.Mock).mockResolvedValueOnce([]);

    const wrapper = mount(
      <Router initialEntries={["/angelhistory/1"]}>
        <AngelHistory />
      </Router>
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper.find(".angel-history").exists()).toBe(true);
    expect(wrapper.find(".history-list").text()).toContain("No history available for this angel.");
  });

  test("shows error message on fetch failure", async () => {
    (AngelService.getAngelHistory as jest.Mock).mockRejectedValueOnce(new Error("Failed to fetch"));

    const wrapper = mount(
      <Router initialEntries={["/angelhistory/1"]}>
        <AngelHistory />
      </Router>
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper.find(".error-message").exists()).toBe(true);
    expect(wrapper.find(".error-message").text()).toBe("Failed to fetch angel history");
  });

  test("navigates back to angel details", async () => {
    const mockHistory = [
      {
        angelhistory_id: 1,
        description: "First update",
        user_id: "123",
        updated_at: "2024-01-01T12:00:00Z",
      },
    ];

    (AngelService.getAngelHistory as jest.Mock).mockResolvedValueOnce(mockHistory);

    const mockHistoryPush = jest.fn();
    jest.spyOn(require("react-router-dom"), "useHistory").mockReturnValue({ push: mockHistoryPush });

    const wrapper = mount(
      <Router initialEntries={["/angelhistory/1"]}>
        <AngelHistory />
      </Router>
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    wrapper.find(".back-button").simulate("click");

    expect(mockHistoryPush).toHaveBeenCalledWith("/angels/1");
  });
});
    expect(mockHistoryPush).toHaveBeenCalledWith("/angels/1");
  });
});
