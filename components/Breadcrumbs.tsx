import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react/jsx-runtime";

const Breadcrumbs = () => {
  const path = usePathname();
  const segmants = path.split("/");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {segmants.map((segmant, index) => {
          if (!segmant) return null;

          const href = `/${segmants.slice(0, index + 1).join("/")}`;
          const isLast = index === segmants.length - 1;
          return (
            <Fragment key={segmant}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segmant}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{segmant}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
