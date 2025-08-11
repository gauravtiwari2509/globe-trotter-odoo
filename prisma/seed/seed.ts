import {
  PrismaClient,
  Role,
  ActivityType,
  TripStatus,
  ExpenseCategory,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 10;
const NUMBER_OF_USERS = 5;
const NUMBER_OF_COUNTRIES = 3;
const CITIES_PER_COUNTRY = 2;
const ACTIVITIES_PER_CITY = 3;
const TRIPS_PER_USER = 2;
const STOPS_PER_TRIP = 2;
const EXPENSES_PER_TRIP = 2;
const ACTIVITIES_PER_STOP = 2;
const COMMENTS_PER_TRIP = 3;
const FAVORITES_PER_USER = 1;

async function main() {
  console.log("Start seeding...");

  // --- Seed Users and Profiles ---
  const users = [];
  for (let i = 0; i < NUMBER_OF_USERS; i++) {
    const passwordHash = await bcrypt.hash("password123", BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        passwordHash: passwordHash,
        role: i === 0 ? Role.ADMIN : Role.USER,
        verified: true,
        profile: {
          create: {
            displayName: faker.person.fullName(),
            bio: faker.lorem.sentence(),
            avatarUrl: faker.image.avatar(),
          },
        },
      },
    });
    users.push(user);
    console.log(`Created user with id: ${user.id}`);
  }

  // --- Seed Countries and Cities ---
  const countries = [];
  for (let i = 0; i < NUMBER_OF_COUNTRIES; i++) {
    const country = await prisma.country.create({
      data: {
        name: faker.location.country(),
        code: faker.location.countryCode(),
        currency: faker.finance.currencyCode(),
      },
    });
    countries.push(country);
    console.log(`Created country: ${country.name}`);

    // Create cities for each country
    for (let j = 0; j < CITIES_PER_COUNTRY; j++) {
      const city = await prisma.city.create({
        data: {
          name: faker.location.city(),
          // Corrected: Use faker.lorem.slug() instead of faker.string.slug()
          slug: faker.lorem.slug(),
          countryId: country.id,
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
          // Corrected: Use fractionDigits instead of precision
          costIndex: faker.number.float({
            min: 0.5,
            max: 2,
            fractionDigits: 2,
          }),
        },
      });
      console.log(`- Created city: ${city.name} in ${country.name}`);

      // Create activity templates for each city
      for (let k = 0; k < ACTIVITIES_PER_CITY; k++) {
        await prisma.activityTemplate.create({
          data: {
            title: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
            cityId: city.id,
            type: faker.helpers.arrayElement(Object.values(ActivityType)),
            avgDurationMin: faker.number.int({ min: 30, max: 240 }),
            // Corrected: Use fractionDigits instead of precision
            price: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
          },
        });
      }
    }
  }

  // --- Seed Trips, Stops, Activities, Expenses, and Comments ---
  const allCities = await prisma.city.findMany();
  const allActivityTemplates = await prisma.activityTemplate.findMany();

  for (const user of users) {
    for (let i = 0; i < TRIPS_PER_USER; i++) {
      const trip = await prisma.trip.create({
        data: {
          ownerId: user.id,
          title: faker.lorem.words(4),
          // Corrected: Use faker.lorem.slug() instead of faker.string.slug()
          slug: faker.lorem.slug(),
          description: faker.lorem.paragraph(),
          status: faker.helpers.arrayElement(Object.values(TripStatus)),
          startDate: faker.date.future(),
          endDate: faker.date.future(),
        },
      });
      console.log(`Created trip for user ${user.id}: ${trip.title}`);

      // Create stops for each trip
      const tripStops = [];
      for (let j = 0; j < STOPS_PER_TRIP; j++) {
        const stop = await prisma.tripStop.create({
          data: {
            tripId: trip.id,
            cityId: faker.helpers.arrayElement(allCities).id,
            arrival: faker.date.future(),
            departure: faker.date.future(),
            order: j,
          },
        });
        tripStops.push(stop);

        // Create activities for each stop
        for (let k = 0; k < ACTIVITIES_PER_STOP; k++) {
          await prisma.tripActivity.create({
            data: {
              tripId: trip.id,
              stopId: stop.id,
              templateId: faker.helpers.arrayElement(allActivityTemplates).id,
              title: faker.lorem.words(3),
              startTime: faker.date.future(),
              endTime: faker.date.future(),
              // Corrected: Use fractionDigits instead of precision
              price: faker.number.float({
                min: 5,
                max: 200,
                fractionDigits: 2,
              }),
            },
          });
        }
      }

      // Create expenses for each trip
      for (let k = 0; k < EXPENSES_PER_TRIP; k++) {
        await prisma.expense.create({
          data: {
            tripId: trip.id,
            stopId: faker.helpers.arrayElement(tripStops).id,
            title: faker.lorem.words(2),
            category: faker.helpers.arrayElement(
              Object.values(ExpenseCategory)
            ),
            // Corrected: Use fractionDigits instead of precision
            amount: faker.number.float({
              min: 10,
              max: 1000,
              fractionDigits: 2,
            }),
          },
        });
      }

      // Create comments for each trip
      for (let k = 0; k < COMMENTS_PER_TRIP; k++) {
        await prisma.comment.create({
          data: {
            authorId: faker.helpers.arrayElement(users).id,
            tripId: trip.id,
            content: faker.lorem.sentence(),
          },
        });
      }

      // Create Public Itinerary for some trips
      if (Math.random() > 0.5) {
        await prisma.publicItinerary.create({
          data: {
            tripId: trip.id,
            // Corrected: Use faker.lorem.slug() instead of faker.string.slug()
            slug: faker.lorem.slug(),
            publishedAt: faker.date.past(),
            viewCount: faker.number.int({ min: 0, max: 1000 }),
          },
        });
      }
    }

    // Create favorites for each user
    const randomTrip = faker.helpers.arrayElement(await prisma.trip.findMany());
    await prisma.favorite.create({
      data: {
        userId: user.id,
        tripId: randomTrip.id,
      },
    });
  }

  // --- Seed Media ---
  const allTrips = await prisma.trip.findMany();
  const allActivityTemplatesForMedia = await prisma.activityTemplate.findMany();
  const allUsersForMedia = await prisma.user.findMany();

  for (let i = 0; i < 10; i++) {
    const media = await prisma.media.create({
      data: {
        url: faker.image.url(),
        altText: faker.lorem.sentence(),
        uploadedById: faker.helpers.arrayElement(allUsersForMedia).id,
      },
    });
    // Link media to some trips
    if (i < allTrips.length) {
      await prisma.trip.update({
        where: { id: allTrips[i].id },
        data: { coverMediaId: media.id },
      });
    }
    // Link media to some activity templates
    if (i < allActivityTemplatesForMedia.length) {
      await prisma.activityTemplate.update({
        where: { id: allActivityTemplatesForMedia[i].id },
        data: { images: { connect: { id: media.id } } },
      });
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
