import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationProps = {
  onClickPrevious: () => void;
  onClickNext: () => void;
};
const PaginationTable = (props: PaginationProps) => {
  const { onClickPrevious, onClickNext } = props;
  return (
    <Pagination className=" justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious className=" cursor-pointer" onClick={onClickPrevious} />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext className=" cursor-pointer" onClick={onClickNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationTable;
