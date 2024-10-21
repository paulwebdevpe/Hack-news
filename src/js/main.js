import axios from "axios";
import _ from "lodash";

let currentIndex = 0;
let fetchedIds = new Set(); // Set to store unique IDs

const getDataId = async () => {
  try {
    const response = await axios.get(
      `https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty`
    );
    // Get the next 10 IDs from the response
    const dataNews = response.data?.slice(currentIndex, currentIndex + 10)
    
    // Filter out already fetched IDs
    const newIds = dataNews.filter((id) => !fetchedIds.has(id));
    newIds.forEach((id) => fetchedIds.add(id));

    await Promise.all(newIds.map((id) => getDataNews(id)));

    currentIndex += 10;

  } catch (error) {
    console.error("Error fetching story IDs:", error);
  }
};

const getDataNews = async (id) => {
  try {
    const response = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
    );

    const dataNews = response.data;

    displayNews(dataNews);
  } catch (error) {
    console.error(`Error fetching data for story ID ${id}:`, error);
  }
};

function displayNews(data) {
  const resultNews = document.querySelector(".result");
  const unixTime = data.time;
  const date = new Date(unixTime * 1000);

  const urlStories = _.get(data, "url", "No url aviable");
  const titleStories = _.get(data, "title", "No title aviable");

  const NewsDetails = `
   
      <li class="pb-2 border-2 rounded-3xl border-[#00ff9f] h-[200px] md:h-[300px] my-4  md:my-0 p-2 flex-col  flex  items-center justify-between ">
          <h2 class=" text-2xl h-30  md:text-start font-semibold py-2 text-white text-center block">
            ${titleStories}
          </h2>
          <a 
            class="font-medium 	border-2 border-[#cb0c59] hover:scale-110 hover:border-[#7b1346] w-1/2 mx-auto flex justify-center py-2 px-4 rounded-full" 
            href="${urlStories}">
              <span class="material-symbols-outlined text-[#cb0c59] ">rocket_launch </span>
          </a>
          <p class="flex  items-end  text-white py-2 text-center md:text-start ">${date.toLocaleString()}</p>
      </li> 
    `;

  resultNews.innerHTML += NewsDetails;
}

document.getElementById("load-more").addEventListener("click", getDataId);

getDataId();
